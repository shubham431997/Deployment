import admin from "../config/firebase.js";
import DeviceTokenRepository from "../repositories/deviceToken.repository.js";
import { statusCode } from "../utils/statusCode.js";
import OrderRepository from  '../repositories/order.repository.js'

class NotificationService  {
  async sendNotification(userId, title, message, imageUrl = null) {
    try {
      const devices = await DeviceTokenRepository.getTokensByUserId(userId);

      if (devices.length === 0) {
        console.log(`No registered devices for user: ${userId}`);
        return { status: statusCode.NOT_FOUND, message: "No registered devices found." };
      }

      const tokens = devices.map((device) => device.token);

      const payload = {
        tokens,
        notification: {
          title,
          body: message,
          image: imageUrl,  // ✅ Adds image support
        },
      };

      const response = await admin.messaging().sendEachForMulticast(payload);

     // console.log("Notification sent successfully:", response);
      return { status: statusCode.OK, message: "Notification sent successfully." };
    } catch (error) {
     // console.error("Error sending notification:", error);
      return { status: statusCode.BAD_GATEWAY, message: error.message };
    }
  }

  async sendOrderStatusNotification(orderId, status) {
    try {
      const order = await OrderRepository.getOrderById(orderId);
      if (!order) {
        console.log(`Order not found: ${orderId}`);
        return;
      }

      const userId = order.userId;
      const userName = order.user.name;
      const devices = await DeviceTokenRepository.getTokensByUserId(userId);

      if (devices.length === 0) {
        console.log(`No registered devices for user: ${userId}`);
        return;
      }

      const tokens = devices.map((device) => device.token);

      const payload = {
        tokens,
        notification: {
          title: `Hi ${userName}`,
          body: `Your order number ${orderId} is now ${status}`,
        },
      };

      const response = await admin.messaging().sendEachForMulticast(payload);
     // console.log("Notification sent successfully:", response);
    } catch (error) {
    //  console.error("Error sending order status notification:", error);
    }
  }

  async sendCartNotification(userId, title, message) {
    try {

      const devices = await DeviceTokenRepository.getTokensByUserId(userId);

      if (devices.length === 0) {
        console.log(`No registered devices for user: ${userId}`);
        return { status: statusCode.NOT_FOUND, message: "No registered devices found." };
      }

      const tokens = devices.map((device) => device.token);

      const payload = {
        notification: {
          title,
          body: message,
        },
      };

      const response = await admin.messaging().sendEachForMulticast({
        tokens,
        ...payload,
      });

      console.log(" Notification sent successfully:", response);
      return { status: statusCode.OK, message: "Notification sent successfully." };
    } catch (error) {
      console.error("Error sending notification:", error);
      return { status: statusCode.BAD_GATEWAY, message: error.message };
    }
  }

};

export default new NotificationService();
