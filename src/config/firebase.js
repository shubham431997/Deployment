import admin from "firebase-admin";
import serviceAccount from "/etc/secrets/sarafoods-firebase-adminsdk-fbsvc-8af93f3c7c.json" assert { type: "json" };


if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const sendPushNotification = async (tokens, message) => {
  try {
    if (!tokens || tokens.length === 0) {
      console.error("No valid FCM tokens provided.");
      return;
    }

    const payload = {
      notification: {
        title: message.title,
        body: message.body,
      },
      data: message.data || {}, // Additional data
    };

    const response = await admin.messaging().sendEachForMulticast({
      tokens, // Array of FCM tokens
      notification: payload.notification,
      data: payload.data,
    });

    console.log("Push Notification Response:", response);

    // ✅ Log failed tokens (if any)
    if (response.failureCount > 0) {
      response.responses.forEach((resp, index) => {
        if (!resp.success) {
          console.error(`❌ Error sending to token ${tokens[index]}:`, resp.error);
        }
      });
    }
  } catch (error) {
    console.error("🔥 Error sending push notification:", error);
  }
};

export default admin;
