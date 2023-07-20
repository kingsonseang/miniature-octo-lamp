const dotenv = require('dotenv')
dotenv.config()

const mailer = require('nodemailer');

const Transporter = mailer.createTransport({
  service: process.env.SMTP_PROVIDER,
  host: process.env.SMTP_PROVIDER_HOST_SERVER,
  port: 2525,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

async function SendMail(to, subject, text, html) {
    try {
        const options = {
            from: `${process.env.COMPANY} <${process.env.EMAIL}>`,
            to:to,
            subject: subject,
            text: text,
          };
          console.log(options);
        const mail = await Transporter.sendMail(options)
        return { sent: true }
    } catch (err) {
        return console.error(err)
    }
}

module.exports = SendMail