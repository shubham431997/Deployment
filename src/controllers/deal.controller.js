import DealService from '../services/deal.service.js';
import { statusCode } from '../utils/statusCode.js';

class DealsController {
  

  async getAllDeals(req, res) {
    try {
      const result = await DealService.getAllDeals();
      res.status(result.status).json({ message: result.message, data: result.data });
    } catch (error) {
      res.status(error.status || statusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }

  // Create a new deal
  async createDeal(req, res) {
    try {
      const dealData = req.body;
      const result = await DealService.createDeal(dealData);
      res.status(result.status).json({ message: result.message, data: result.data });
    } catch (error) {
      res.status(error.status || statusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }
}

export default new DealsController();
