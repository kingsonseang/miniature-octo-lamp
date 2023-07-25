const SendMail = require('./mailer');

async function sendLoginEmail(user, device) {
  const result = await SendMail(
    user.email,
    'You Signed In To Your BB Account',
    `Hi ${user.name.first} 👋
    \nYou signed in to your Black Bento account
    \nDevice: ${device.brand} ${device.productName} ${device.modelName}
    \nLocation: 
    \nIf you didn’t authorise this sign-in, please change your email password immediately then send a message to help@blackbento.com
    \nLove,
    \nBlack Bento 🍱`,
    null
  );

  console.log(result);

  if (result?.sent) {
    return { sent: true };
  }

  return { sent: false };
}

module.exports = sendLoginEmail;
