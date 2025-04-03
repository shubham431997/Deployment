import DashboardService from "../services/dashboard.service.js";
export class DashboardController {
  async getDashboardData(req, res) {
    try {
      const result = await DashboardService.getDashboardData();
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }

  async getTopSoldProducts(req, res) {
    try {
      const topProducts = await DashboardService.getTopSoldProducts();
      return res
        .status(topProducts.status)
        .json({ message: topProducts.message, data: topProducts.data });
    } catch (error) {
      return res
        .status(error.status || 500)
        .json({ error: error.message || "Internal Server Error" });
    }
  }

  async getTopSoldProductsByWeek(req, res) {
    try {
      const response = await DashboardService.getTopSoldProductsByPeriod(
        "week"
      );
      return res.status(response.status).json(response);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getTopSoldProductsByMonth(req, res) {
    try {
      const response = await DashboardService.getTopSoldProductsByPeriod(
        "month"
      );
      return res.status(response.status).json(response);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default new DashboardController();
