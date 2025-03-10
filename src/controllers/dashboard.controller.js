import  DashboardService  from '../services/dashboard.service.js';

export class DashboardController {
   async getDashboardData(req, res) {
    try {
      const counts = await DashboardService.getDashboardCounts();
      return res.status(counts.status).json({
        message: counts.message,
        data: counts.data,
      });
    } catch (error) {
        return res.status(error.status|| 500).json({ error: error.message });
    }
  }

  async getTopSoldProducts(req, res) {
    try {
        const topProducts = await DashboardService.getTopSoldProducts();
        return res.status(topProducts.status).json({message: topProducts.message,data: topProducts.data});
    } catch (error) {
        return res.status(error.status || 500).json({ error: error.message || "Internal Server Error"  });
    }
  }
  
}

export default new DashboardController();
