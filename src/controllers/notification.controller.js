import DeviceTokenRepository from "../repositories/deviceToken.repository.js";
import NotificationService from "../services/notification.service.js";

class NotificationController  {
  
  async registerToken(req, res) {
    const { userId, token } = req.body;

    if (!userId || !token) {
      return res.status(400).json({ message: "userId and token are required." });
    }

    try {
      const result = await DeviceTokenRepository.saveToken(userId, token);
      res.status(result.status).json({ message: "Device token registered successfully." });
    } catch (error) {
      return res.status(error?.status || 500).json({ error: error.message });
    }
  }

  async sendNotification(req, res) {
    const { userId, title, message, imageUrl } = req.body;  // ✅ Accepts imageUrl

    if (!userId || !title || !message) {
      return res.status(400).json({ message: "userId, title, and message are required." });
    }

    try {
      const response = await NotificationService.sendNotification(userId, title, message, imageUrl);
      return res.status(response.status).json(response);
    } catch (error) {
      return res.status(error?.status || 500).json({ error: error.message });
    }
  }
};

export default new NotificationController();
