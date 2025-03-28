import cron from "node-cron";
import admin from "../config/firebase.js";
import DeviceTokenRepository from "../repositories/deviceToken.repository.js";
import { statusCode } from "../utils/statusCode.js";
import OrderRepository from "../repositories/order.repository.js";
import userRepository from "../repositories/user.repository.js";
import CartRepository from "../repositories/cart.repository.js";

class NotificationService {
  /**
   * Send notification to a specific user.
   */
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

      await admin.messaging().sendEachForMulticast(payload);
      return { status: statusCode.OK, message: "Notification sent successfully." };
    } catch (error) {
      return { status: statusCode.BAD_GATEWAY, message: error.message };
    }
  }

  /**
   * Send order status update notification.
   */
  async sendOrderStatusNotification(orderId, status) {
    try {
      const order = await OrderRepository.getOrderById(orderId);
      if (!order) {
        console.log(`Order not found: ${orderId}`);
        return;
      }

      const userId = order.userId;
      const devices = await DeviceTokenRepository.getTokensByUserId(userId);
      const userName = await userRepository.getById(userId);

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

      await admin.messaging().sendEachForMulticast(payload);
    } catch (error) {
      console.error("Error sending order status notification:", error);
    }
  }

  /**
   * Send cart reminder notification.
   */
  async sendCartNotification(userId, title, message) {
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
        },
      };

      await admin.messaging().sendEachForMulticast(payload);
      console.log("Notification sent successfully.");
      return { status: statusCode.OK, message: "Notification sent successfully." };
    } catch (error) {
      console.error("Error sending notification:", error);
      return { status: statusCode.BAD_GATEWAY, message: error.message };
    }
  }

  /**
   * Schedule a cron job to check for abandoned carts.
   */
  scheduleCartReminderJob() {
    cron.schedule("*/5 * * * * *", async () => {
      console.log("Checking for abandoned carts...");

      const fiveHoursAgo = new Date();
      fiveHoursAgo.setHours(fiveHoursAgo.getHours() - 5);

      try {
        const abandonedCarts = await CartRepository.getAbandonedCarts(fiveHoursAgo);

        for (const cart of abandonedCarts) {
          await this.sendCartNotification(
            cart.userId,
            "🛍️ Your Cart is Waiting!",
            "Your favorite items are still in the cart! Grab them before they’re gone! ⏳"
          );
        }

        console.log(`Sent ${abandonedCarts.length} cart reminders.`);
      } catch (error) {
        console.error("Error checking abandoned carts:", error);
      }
    });

    console.log("✅ Cart reminder cron job scheduled.");
  }
}

// Create instance and start cron job
const notificationService = new NotificationService();
notificationService.scheduleCartReminderJob();

export default notificationService;

