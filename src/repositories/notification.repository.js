import Notification from "../models/Notification.js";

class NotificationRepository {
  async createNotification(notificationData) {
    console.log("------not repo");
    console.log(notificationData);
    return await Notification.create({
      userId: notificationData.userId,
      title: notificationData.title,
      message: notificationData.body,
      data: notificationData.data
        ? JSON.stringify(notificationData.data)
        : null,
    });
  }

  async getNotificationsById(userId) {
    return await Notification.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });
  }

  async markNotificationAsRead(notificationId) {
    return await Notification.update(
      { isRead: true },
      { where: { id: notificationId } }
    );
  }
}

export default new NotificationRepository();
