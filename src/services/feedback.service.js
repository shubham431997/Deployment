import FeedbackRepository from '../repositories/feedback.repository.js';
import { statusCode } from '../utils/statusCode.js';
import { sendFeedbackMail } from '../utils/mail.js';
import userRepository from '../repositories/user.repository.js';

class FeedbackService {
  
    async submitFeedback(feedbackData) {
        try {
          const feedback = await FeedbackRepository.createFeedback(feedbackData);
      
          const user = await userRepository.getById(feedbackData.userId);
      
          if (!user) {
            return { status: statusCode.NOT_FOUND, message: 'User not found' };
          }
      
          await sendFeedbackMail(user.email, user.name, feedbackData.accountDeletionReason, feedbackData.feedback);
      
          return { status: statusCode.OK, message: 'Feedback submitted successfully', data: feedback };
        } catch (error) {
          throw { status: error.status || statusCode.BAD_GATEWAY, message: error.message };
        }
      }


}

export default new FeedbackService();
