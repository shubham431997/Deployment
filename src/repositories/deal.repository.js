import Deal from '../models/Deals.js';
import Product from '../models/Product.js';

class DealRepository {
  
  async createDeal (dealData) {
    return await Deal.create(dealData);
  };
  
  async getDeals  () {
    return await Deal.findAll();
  };
}

export default new DealRepository();
