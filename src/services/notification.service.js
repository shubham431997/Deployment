import admin from "../config/firebase.js";
import DeviceTokenRepository from "../repositories/deviceToken.repository.js";
import { statusCode } from "../utils/statusCode.js";
import OrderRepository from  '../repositories/order.repository.js'
import userRepository from "../repositories/user.repository.js";
import notificationRepository from "../repositories/notification.repository.js";

class NotificationService  {

  async createNotification(userId, title, body, data = {}) {
    return await notificationRepository.createNotification({
      userId,
      title,
      body,
      data,
    });
  }  
  
  async getNotificationsByUserId(userId) {
    return await notificationRepository.getNotificationsById(userId);
  }

  async markNotificationAsRead(notificationId) {
    return await notificationRepository.markNotificationAsRead(notificationId);
  }

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
     // console.log("order: ", order);
      if (!order) {
        console.log(`Order not found: ${orderId}`);
        return;
      }

      const userId = order.userId;
      const devices = await DeviceTokenRepository.getTokensByUserId(userId);
      const userName = await userRepository.getById(userId);
      console.log("UserName :",userName.name);

      if (devices.length === 0) {
        console.log(`No registered devices for user: ${userId}`);
        return;
      }

      const tokens = devices.map((device) => device.token);

      const payload = {
        tokens,
        notification: {
          title: `🚀 Order Update, ${userName.name}`,
          body: `Your order #${orderId} is now **${status}**. Check the app for details! 📦`,
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
