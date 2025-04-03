import DealRepository from '../repositories/deal.repository.js';
import { statusCode } from '../utils/statusCode.js';

class DealService {
  
  

  // Get all deals with count of associated products
  async getAllDeals() {
    try {
      const deals = await DealRepository.getDeals();
      return { status: statusCode.OK, message: 'All deals retrieved successfully', data: deals };
    } catch (error) {
      throw { status: statusCode.BAD_GATEWAY, message: error.message };
    }
  }

  // Create a new deal with associated products
  async createDeal(dealData) {
    try {
      const deal = await DealRepository.createDeal(dealData);
      return { status: statusCode.OK, message: 'Deal created successfully!', data: deal };
    } catch (error) {
      throw { status: statusCode.BAD_GATEWAY, message: error.message };
    }
  }

 
}

export default new DealService();
