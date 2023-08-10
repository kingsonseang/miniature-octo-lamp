const { Expo } = require("expo-server-sdk");

const sendPushNotification = async (targetExpoPushTokens, notificationData) => {
  const expo = new Expo();

  const notifications = targetExpoPushTokens.map(token => ({
    to: token.publicId,
    sound: "default",
    title: notificationData.title,
    body: notificationData.body,
    data: {
      screenToOpen: notificationData.screenToOpen,
    },
  }));

  const chunks = expo.chunkPushNotifications(notifications);

  const sendChunks = async () => {
    try {
      await Promise.all(
        chunks.map(async chunk => {
          console.log("Sending Chunk", chunk);
          try {
            const tickets = await expo.sendPushNotificationsAsync(chunk);
            console.log("Tickets", tickets);
            tickets.forEach(ticket => {
              if (ticket.status === "error") {
                console.log("Error sending notification", ticket.message);
              }
            });
          } catch (error) {
            console.log("Error sending chunk", error);
          }
        })
      );
    } catch (error) {
      console.log("Error sending notifications", error);
    }
  };

  await sendChunks();
};

module.exports = sendPushNotification;
