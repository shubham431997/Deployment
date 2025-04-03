import DeviceTokenRepository from "../repositories/deviceToken.repository.js";
import notificationService from "../services/notification.service.js";
import NotificationService from "../services/notification.service.js";

class NotificationController {
  async registerToken(req, res) {
    const { token } = req.body;
    const userId = req.user.id;
    try {
      const result = await DeviceTokenRepository.saveToken(userId, token);
      const statusCode = result?.status || 200;

      res.status(statusCode).json({
        success: true,
        message: "Device token registered successfully.",
      });
    } catch (error) {
      res.status(error?.status || 500).json({
        success: false,
        message: "Failed to register device token.",
        error: error?.message || "Internal Server Error",
      });
    }
  }

  async registerAdminToken(req, res) {
    const { token } = req.body;
    const adminId = req.user.id;

    try {
      const result = await DeviceTokenRepository.saveToken(adminId, token);
      const statusCode = result?.status || 200;

      res.status(statusCode).json({
        success: true,
        message: "Admin device token registered successfully.",
      });
    } catch (error) {
      res.status(error?.status || 500).json({
        success: false,
        status: error.status,
        message: "Failed to register admin device token.",
        error: error?.message || "Internal Server Error",
      });
    }
  }

  async getAdminTokenById(req, res) {
    const adminId = req.user.id;

    try {
      const token = await DeviceTokenRepository.getTokensByAdminId(adminId);

      if (!token) {
        return res.status(404).json({
          success: false,
          message: "No token found for this admin.",
        });
      }

      res.status(200).json({
        success: true,
        data: token,
      });
    } catch (error) {
      res.status(error?.status || 500).json({
        success: false,
        message: "Failed to fetch admin token.",
        error: error?.message || "Internal Server Error",
      });
    }
  }

  async sendNotification(req, res) {
    const { userId, title, message, imageUrl } = req.body;

    if (!userId || !title || !message) {
      return res
        .status(400)
        .json({ message: "userId, title, and message are required." });
    }

    try {
      const response = await NotificationService.sendNotification(
        userId,
        title,
        message,
        imageUrl
      );
      return res.status(response.status).json(response);
    } catch (error) {
      return res.status(error?.status || 500).json({ error: error.message });
    }
  }

  async getNotifications(req, res) {
    try {
      const userId = req.user.id;
      const notifications = await notificationService.getNotificationsByUserId(
        userId
      );
      return res.status(200).json({ success: true, data: notifications });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async markNotificationAsRead(req, res) {
    try {
      const { notificationId } = req.body;
      await notificationService.markNotificationAsRead(notificationId);
      return res
        .status(200)
        .json({ success: true, message: "Notification marked as read" });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default new NotificationController();

