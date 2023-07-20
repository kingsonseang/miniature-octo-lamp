const mailer = require('nodemailer');

const Transport = mailer.createTransport({
  service: process.env.SMTP_PROVIDER,
  host: process.env.SMTP_PROVIDER_HOST_SERVER,
  port: process.env.SMTP_PORT,
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
            html: html,
          };
        await Transport(options)
        return { sent: true }
    } catch (err) {
        return console.error(err)
    }
}

module.exports = SendMail