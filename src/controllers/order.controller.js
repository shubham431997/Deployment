import orderService from "../services/order.service.js";
import NotificationService from '../services/notification.service.js'

class OrderController {
  async createOrder(req, res) {
    try {
      console.log("create order", req.body);
      const userId = req.user.id;
      const {
        cartItems,
        total,
        deliveryFee,
        grandTotal,
        address,
        payment_mode,
        payment_id
      } = req.body;

      const orderData = {
        userId,
        cartItems,
        total,
        deliveryFee,
        grandTotal,
        address,
        payment_mode,
        payment_id,
        status: "Created"
      };
      console.log("order data", orderData);
      const order = await orderService.createOrder(orderData);
      return res
        .status(order.status)
        .json({ message: order.message, order: order.data });
    } catch (error) {
      return res.status(error.status).json({ error: error.message });
    }
  }

  async updateOrderStatus(req, res) {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      const result = await orderService.updateOrderStatus(orderId, status);
      if (result.status === 200) {
        await NotificationService.sendOrderStatusNotification(orderId, status);
      }
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(error.status).json({ error: error.message });
    }
  }

  async getUserOrders(req, res) {
    try {
      const userId = req.user.id;
      const orders = await orderService.getUserOrders(userId);
      return res
        .status(orders.status)
        .json({ message: orders.message, orders: orders.data });
    } catch (error) {
      return res.status(error.status).json({ error: error.message });
    }
  }

  async getAllOrders(req, res) {
    try {
      const orders = await orderService.getAllOrders();
      return res
        .status(orders.status)
        .json({ message: orders.message, orders: orders.data });
    } catch (error) {
      return res.status(error.status).json({ error: error.message });
    }
  }

  async getOrderById(req, res) {
    try {
        const orderId = req.params.id; 
        const result = await orderService.getOrderById(orderId); 
        res.status(result.status).json({ message: result.message, order: result.data });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
}

  async deleteOrder(req, res) {
    try {
      const { id: orderId } = req.params;
      const result = await orderService.deleteOrder(orderId);
      res.status(result.status).json(result);
    } catch (error) {
      res.status(error.status).json({ message: error.message });
    }
  }

  async getOrderByIdAndUserDeatils(req, res) {
    try {
        const { id: orderId } = req.params;
        const result = await orderService.getOrderByIdAndUserDeatils(orderId);
        res.status(result.status).json(result);
    } catch (error) {
        res.status(error.status).json({ message: error.message });
    }
  }

  
}

export default new OrderController();
