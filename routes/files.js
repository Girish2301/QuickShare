const router = require('express').Router();
const upload = require('../config/fileUpload');
const { v4: uuidv4 } = require('uuid');
const File = require('../models/files');
const sendEmail = require('../services/emailer');
const emailTemplate = require('../utils/emailTemplate');
const qrcode = require('qrcode');
const path = require('path');
const fs = require('fs');

const BASE_URL = process.env.APP_BASE_URL;

router.post('/upload', (req, res) => {
    upload(req, res, async () => {
        try {
            if(!req.file) {
                return res.status(404).json({ err: "File not detected" });
            }
            
            const file = new File({
                fileName: req.file.originalname,
                uuid: uuidv4(),
                path: req.file.path,
                size: req.file.size,
                sender: req.body.sender || 'unknown',  
                receiver: req.body.receiver || 'unknown'
            });
            
            const savedFile = await file.save();
            const fileLink = `${BASE_URL}/api/pages/download-page/${savedFile.uuid}`;
            
            return res.status(200).json({
                file: fileLink
            });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ error: "Server error" });
        }
    });
});

router.post('/send', async (req, res) => {
    try {
        const { uuid, senderEmail, receiverEmail } = req.body;
        
        if(!(uuid && receiverEmail && senderEmail)) {
            return res.status(422).json({error: "All fields are necessary" });
        }
        
        const foundFile = await File.findOne({ uuid: uuid });
        
        if(!foundFile) {
            return res.status(404).json({ error: "File not found" });
        }
        
        foundFile.sender = senderEmail;
        foundFile.receiver = receiverEmail;
        await foundFile.save();
        
        sendEmail({
            from: senderEmail,
            to: receiverEmail,
            subject: "File Shared With You",
            text: `${senderEmail} shared a file with you`,
            html: emailTemplate({
                emailFrom: senderEmail,
                downloadLink: `${BASE_URL}/api/pages/download-page/${foundFile.uuid}`,
                size: parseInt(foundFile.size / (1024 * 1024)) + "MB",
                expires: "24 Hours"
            })
        });
        
        return res.status(200).json({ success: true });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Server error" });
    }
});

router.get('/download/:uuid', async (req, res) => {
    try {
        const file = await File.findOne({ uuid: req.params.uuid });
        
        if(!file) {
            return res.status(404).render('downloads', { err: "Link has expired" });
        }
        
        const filePath = path.join(__dirname, '../', file.path);
        return res.download(filePath, file.fileName);
    } catch (e) {
        return res.status(500).render('downloads', { err: "Server error" });
    }
});

router.get('/generate-qr/:uuid', async (req, res) => {
    try {
        const file = await File.findOne({ uuid: req.params.uuid });
        
        if(!file) {
            return res.status(404).json({ error: "File not found" });
        }
        
        const fileLink = `${BASE_URL}/api/pages/download-page/${file.uuid}`;
        
        const qrBuffer = await qrcode.toBuffer(fileLink, {
            errorCorrectionLevel: 'H',
            type: 'png',
            margin: 1,
            width: 300
        });
        
        res.set('Content-Type', 'image/png');
        return res.send(qrBuffer);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "QR code generation failed" });
    }
});

module.exports = router;
