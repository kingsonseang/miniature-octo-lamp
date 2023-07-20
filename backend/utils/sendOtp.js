const SendMail = require("./mailer");

async function sendOtp(email, otp) {

    const result = await SendMail(
        email,
        'OTP Verification',
        `Your One-Time Password (OTP) is: ${otp}`,
        null
    )

    console.log(result);

    if (result?.sent) {
        return { sent: true }
    }

    return { sent: false }
}

module.exports = sendOtp