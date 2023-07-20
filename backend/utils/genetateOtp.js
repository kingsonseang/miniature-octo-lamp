const randtoken = require('rand-token').generator();

function generateOTP() {
  return randtoken.generate(6, '0123456789');
}

module.exports = generateOTP;
