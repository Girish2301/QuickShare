const mailer = require('nodemailer');
const HOST = process.env.SMTP_HOST_URL;
const PORT = process.env.SMTP_PORT;
const USER = process.env.MAIL_USER;
const PASSWORD = process.env.MAIL_PASSWORD;
const VERIFIED_EMAIL = process.env.VERIFIED_EMAIL;

function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const sendEmailWithRetry = async (emailData, retries = 2) => {
    try {
        if (!emailData.to || !isValidEmail(emailData.to)) {
            console.error(`❌ Invalid recipient email address: ${emailData.to}`);
            return { success: false, error: 'Invalid recipient email address' };
        }

        let transporter = mailer.createTransport({
            host: HOST,
            port: PORT,
            secure: false,
            auth: {
                user: USER,
                pass: PASSWORD
            },

            connectionTimeout: 10000,
            greetingTimeout: 5000,
            socketTimeout: 10000
        });

        console.log(`📧 Attempting to send email to ${emailData.to}...`);
        
        let info = await transporter.sendMail({
            from: `QuickShare <${VERIFIED_EMAIL}>`,
            to: emailData.to,
            subject: emailData.subject,
            text: emailData.text,
            html: emailData.html
        });
        
        console.log(`✅ Email sent successfully to ${emailData.to}! Message ID: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (e) {
        console.error(`❌ Email sending failed to ${emailData.to}:`, e.message);
        
        if (retries > 0) {
            console.log(`🔄 Retrying email to ${emailData.to}... (${retries} attempts left)`);

            const delay = (3 - retries) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
            return sendEmailWithRetry(emailData, retries - 1);
        }
        
        return { success: false, error: e.message };
    }
};

const sendEmail = async ({ from, to, subject, text, html }) => {
    return sendEmailWithRetry({ from, to, subject, text, html });
};

module.exports = sendEmail;