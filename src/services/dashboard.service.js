import  DashboardRepository  from '../repositories/dashboard.repository.js';
import { statusCode }  from '../utils/statusCode.js';
export class DashboardService {
    
  async getDashboardCounts() {
    try {
      const dashBoardData =  await DashboardRepository.getCounts();
      return { status: statusCode.OK, message: 'All dashboardData retrieved successfully', data:dashBoardData};
    } catch (error) {
      return { status: statusCode.BAD_GATEWAY, message: error.message };
    }
  }
  async getTopSoldProducts() {
    try {
        const topProducts = await DashboardRepository.getTopSoldProducts();
        return {status: statusCode.OK,message: "Top 5 sold products retrieved successfully",data: topProducts};
    } catch (error) {
        return { status: statusCode.BAD_GATEWAY, message: error.message};
    }
  }

  async getTopSoldProductsByPeriod(period) {
    try {
      const data = await DashboardRepository.getTopSoldProductsByPeriod(period);
      return { status: 200, message: `Top 7 sold products in ${period}`, data };
    } catch (error) {
      return { status: 502, message: error.message };
    }
  }

  async getDashboardData() {
    try {
       const counts = await DashboardRepository.getCounts();
       const salesTotals = await DashboardRepository.getSalesTotals(); 
       const monthlySalesData = await DashboardRepository.getMonthlySalesData();
       return {
          status: statusCode.OK,
          message: 'Dashboard data retrieved successfully',
          dashData: { counts, salesTotals, monthlySalesData } 
       };
    } catch (error) {
       return { status: statusCode.BAD_GATEWAY, message: error.message };
    }
 }

}

export default new DashboardService();
