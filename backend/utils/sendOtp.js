const SendMail = require("./mailer");

async function sendOtp(email, otp) {

    const result = await SendMail({
        to: email,
        subject: 'OTP Verification',
        text: `Your One-Time Password (OTP) is: ${otp}`,
        html: null
    })

    if (result?.sent) {
        return { sent: true }
    }

    return { sent: false }
}

module.exports = sendOtp