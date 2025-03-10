import  Product  from '../models/Product.js';
import  Category  from '../models/Category.js';
import  Order  from '../models/Order.js';
import  User  from '../models/User.js';
import { Op } from "sequelize";

export class DashboardRepository {
   async getCounts() {
      const productCount = await Product.count();
      const categoryCount = await Category.count();
      const totalOrderCount = await Order.count();
      const userCount = await User.count();

      const createdOrder = await Order.count({ where: { status: "Created"}});
      const deliveredOrder = await Order.count({where: {status: "Delivered"}});
      return { productCount, categoryCount, totalOrderCount, userCount, createdOrder, deliveredOrder};
  }

  async getTopSoldProducts() {
   const orders = await Order.findAll({ attributes: ["cartItems"] });

   let productSales = {};

   orders.forEach(order => {
       const cartItems = order.cartItems || [];
       cartItems.forEach(item => {
           const productId = item.productId;
           const quantity = item.quantity || 1;

           if (productSales[productId]) {
               productSales[productId] += quantity;
           } else {
               productSales[productId] = quantity;
           }
       });
   });


   const sortedProducts = Object.entries(productSales)
       .sort((a, b) => b[1] - a[1])
       .slice(0, 5); 

   const topProducts = await Product.findAll({
       where: { id: { [Op.in]: sortedProducts.map(p => p[0]) } },
       attributes: ["id", "name", "weightNprice", "image"],
   });

   return topProducts.map(product => ({
       ...product.dataValues,
       soldQuantity: productSales[product.id] || 0
   }));
}

}
export default new DashboardRepository();
