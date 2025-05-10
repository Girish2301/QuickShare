require('dotenv').config({path: "../.env"});
const File = require('../models/files');
const fs = require('fs');

let fetchandDeleteData = async () => {
    try {
        const files = await File.find({
            createdAt: {
                $lt: new Date(Date.now() - 24 * 60 * 60 * 1000)
            }
        });
        if(files.length){
            for(const file of files) {
                try {
                    fs.unlinkSync('../' + file.path);
                    await file.remove();
                } catch (e) {
                    console.error("Error: ", e);
                }
            }
        }
    } catch( e ) {
        console.error("Error: ",e);
    }
};

module.exports = { fetchandDeleteData };