import admin from "../config/firebase.js";
import DeviceTokenRepository from "../repositories/deviceToken.repository.js";
import { statusCode } from "../utils/statusCode.js";
import OrderRepository from "../repositories/order.repository.js";

class NotificationService {
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
          image: imageUrl,
        },
      };

      const response = await admin.messaging().sendEachForMulticast(payload);
      return { status: statusCode.OK, message: "Notification sent successfully." };
    } catch (error) {
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
    //  console.log("order eatils:" ,order);
      const userId = order.userId;
     // const userName = order.User.name;
      const devices = await DeviceTokenRepository.getTokensByUserId(userId);

      if (devices.length === 0) {
        console.log(`No registered devices for user: ${userId}`);
        return;
      }

      const tokens = devices.map((device) => device.token);

      const payload = {
        tokens,
        notification: {
          title: `🚀 Order Update, Sir..!`,
          body: `Your order #${orderId} is now **${status}**. Check the app for details! 📦`,
        },
      };

      const response = await admin.messaging().sendEachForMulticast(payload);
    } catch (error) {
      console.error("Error sending order status notification:", error);
    }
  }

  async sendCartNotification(userId) {
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
          title: "🛍️ Your Cart is Waiting!",
          body: "Your favorite items are still in the cart! Grab them before they’re gone! ⏳",
        },
      };

      const response = await admin.messaging().sendEachForMulticast(payload);
      return { status: statusCode.OK, message: "Notification sent successfully." };
    } catch (error) {
      console.error("Error sending notification:", error);
      return { status: statusCode.BAD_GATEWAY, message: error.message };
    }
  }

  async sendPromoNotification(userId) {
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
          title: "🔥 Limited-Time Offer!",
          body: "Get up to 50% OFF for the next 24 hours. Hurry up! 🕒",
        },
      };

      const response = await admin.messaging().sendEachForMulticast(payload);
      return { status: statusCode.OK, message: "Promotion notification sent successfully." };
    } catch (error) {
      console.error("Error sending promotion notification:", error);
      return { status: statusCode.BAD_GATEWAY, message: error.message };
    }
  }
}

export default new NotificationService();

