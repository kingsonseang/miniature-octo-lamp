const sendPushNotification = require("./utils/sendPushNotification");

const token = 'ExponentPushToken[29DegIM53KvrvK0mcuLJq1]'

function runner() {
    sendPushNotification([{ publicId: token }], {
        body: `Hi there, its me again, this is just a test,\nLets get cooking 🍱`,
        title: `No need for alarm 👋`,
        screenToOpen: undefined
      });
}

runner()