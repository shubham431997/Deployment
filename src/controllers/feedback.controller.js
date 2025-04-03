import feedbackService from '../services/feedback.service.js';
import { statusCode } from '../utils/statusCode.js';

class FeedbackController {


  async createFeedback(req, res) {
    try {
        const userId = req.user.id;
        const feedbackData = { ...req.body, userId };

      const data = await feedbackService.submitFeedback(feedbackData);
      return res.status(data.status).json({ status: data.status, message: data.message, feedback: data.data });
    } catch (error) {
      return res.status(error.status || statusCode.BAD_GATEWAY).json({ error: error.message });
    }
  }
}

export default new FeedbackController();
