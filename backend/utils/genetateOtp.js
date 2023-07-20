const crypto = require('crypto');

const generateOTP = (length) => {
  const buffer = crypto.randomBytes(length);
  let OTP = '';
  for (let i = 0; i < length; i++) {
    OTP += buffer[i].toString().padStart(2, '0');
  }
  return OTP;
};

module.exports = generateOTP;