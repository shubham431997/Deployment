import Feedback from '../models/Feedback.js';

class FeedbackRepository {
    async createFeedback(feedbackData) {
        return await Feedback.create(feedbackData);
    }

    async getFeedbackByUserId(userId) {
        return await Feedback.findAll({ where: { userId } });
    }
}

export default new FeedbackRepository();
