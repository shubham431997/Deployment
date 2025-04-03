import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import { Op } from "sequelize";
import dayjs from "dayjs";

export class DashboardRepository {
  async getCounts() {
    const productCount = await Product.count();
    const categoryCount = await Category.count();
    const totalOrderCount = await Order.count();
    const userCount = await User.count();
    const createdOrder = await Order.count({ where: { status: "Created" } });
    const deliveredOrder = await Order.count({
      where: { status: "Delivered" },
    });
    return {
      productCount,
      categoryCount,
      totalOrderCount,
      userCount,
      createdOrder,
      deliveredOrder,
    };
  }

  async getTopSoldProducts() {
    const orders = await Order.findAll({ attributes: ["cartItems"] });
    let productSales = {};
    orders.forEach((order) => {
      const cartItems = order.cartItems || [];
      cartItems.forEach((item) => {
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
      where: { id: { [Op.in]: sortedProducts.map((p) => p[0]) } },
      attributes: ["id", "name", "weightNprice", "image"],
    });
    return topProducts.map((product) => ({
      ...product.dataValues,
      soldQuantity: productSales[product.id] || 0,
    }));
  }

  async getTopSoldProductsByPeriod(period) {
    let startDate;

    if (period === "week") {
      startDate = dayjs().startOf("week"); // Monday 00:00 AM
    } else if (period === "month") {
      startDate = dayjs().startOf("month"); // 1st day of month 00:00 AM
    }

    const orders = await Order.findAll({
      where: { createdAt: { [Op.gte]: startDate.toDate() } }, // Fetch orders from the start of the period
      attributes: ["cartItems"],
    });

    let productSales = {};
    orders.forEach((order) => {
      const cartItems = order.cartItems || [];
      cartItems.forEach((item) => {
        const productId = item.productId;
        const quantity = item.quantity || 1;
        productSales[productId] = (productSales[productId] || 0) + quantity;
      });
    });

    const sortedProducts = Object.entries(productSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7);

    const topProducts = await Product.findAll({
      where: { id: { [Op.in]: sortedProducts.map((p) => p[0]) } },
      attributes: ["id", "name"],
    });

    return topProducts.reduce((acc, product) => {
      acc[product.name] = productSales[product.id] || 0;
      return acc;
    }, {});
  }

  async getSalesTotals() {
    // Daily sales for delivered orders
    const startOfDay = dayjs().startOf("day").toDate();
    const endOfDay = dayjs().endOf("day").toDate();
    const dailySales = await Order.sum("grandTotal", {
      where: {
        status: "Delivered", // Only count delivered orders
        createdAt: {
          [Op.gte]: startOfDay,
          [Op.lte]: endOfDay,
        },
      },
    });

    // Weekly sales for delivered orders
    const startOfWeek = dayjs().startOf("week").toDate();
    const weeklySales = await Order.sum("grandTotal", {
      where: {
        status: "Delivered", // Only count delivered orders
        createdAt: {
          [Op.gte]: startOfWeek,
        },
      },
    });

    // Monthly sales for delivered orders
    const startOfMonth = dayjs().startOf("month").toDate();
    const monthlySales = await Order.sum("grandTotal", {
      where: {
        status: "Delivered", // Only count delivered orders
        createdAt: {
          [Op.gte]: startOfMonth,
        },
      },
    });

    // Yearly sales for delivered orders
    const startOfYear = dayjs().startOf("year").toDate();
    const yearlySales = await Order.sum("grandTotal", {
      where: {
        status: "Delivered", // Only count delivered orders
        createdAt: {
          [Op.gte]: startOfYear,
        },
      },
    });

    return {
      dailySales: dailySales || 0,
      weeklySales: weeklySales || 0,
      monthlySales: monthlySales || 0,
      yearlySales: yearlySales || 0,
    };
  }

  async getMonthlySalesData() {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "April",
      "May",
      "June",
      "July",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentYear = dayjs().year();

    let monthlySales = {};

    for (let month = 0; month < months.length; month++) {
      const startOfMonth = dayjs().month(month).startOf("month").toDate();
      const endOfMonth = dayjs().month(month).endOf("month").toDate();

      const sales = await Order.sum("grandTotal", {
        where: {
          status: "Delivered", // Only count delivered orders
          createdAt: {
            [Op.gte]: startOfMonth,
            [Op.lte]: endOfMonth,
          },
        },
      });

      monthlySales[months[month]] = sales || 0;
    }

    return monthlySales;
  }
}

export default new DashboardRepository();
