import orderRepository from "../repositories/order.repository.js";
import cartRepository from "../repositories/cart.repository.js";
import { statusCode } from "../utils/statusCode.js";

class OrderService {
  async createOrder(orderData) {
    try {
      const newOrder = await orderRepository.createOrder(orderData);
      await cartRepository.clearCart(orderData.userId);
      return {
        status: statusCode.CREATED,
        message: "Order Created Successfully..",
        data: newOrder,
      };
    } catch (error) {
      return { status: statusCode.BAD_GATEWAY, message: error.message };
    }
  }

  async updateOrderStatus(orderId, status) {
    try {
      const result = await orderRepository.updateOrder(orderId, status);

      if (!result.status) {
        return { status: statusCode.NOT_FOUND, message: result.message };
      }
      return {
        status: statusCode.OK,
        message: "Order Status Updated!",
        data: result.data,
      };
    } catch (error) {
      return { status: statusCode.BAD_GATEWAY, message: error.message };
    }
  }

  async getUserOrders(userId) {
    try {
      const data = await orderRepository.getUserOrders(userId);
      return {
        status: statusCode.OK,
        message: "Order Fetched....!",
        data: data,
      };
    } catch (error) {
      return { status: statusCode.BAD_GATEWAY, message: error.message };
    }
  }

  async getAllOrders() {
    try {
      const data = await orderRepository.getAllOrders();
      if (data.length === 0) {
        return {
          status: statusCode.OK,
          message: "There is No order placed before...!",
        };
      }
      return {
        status: statusCode.OK,
        message: "All Orders Fetched Succefully....!",
        data: data,
      };
    } catch (error) {
      return { status: statusCode.BAD_GATEWAY, message: error.message };
    }
  }

  async getOrderById(orderId) {
    try {
      const order = await orderRepository.getOrderById(orderId);
      console.log("order------", order);
      return { status: statusCode.OK, message: "Order Fetched!", data: order };
    } catch (error) {
      return { status: statusCode.BAD_GATEWAY, message: error.message };
    }
  }

  async deleteOrder(orderId) {
    try {
      const result = await orderRepository.deleteOrder(orderId);
      return { status: statusCode.OK, message: "Order Deleted!", data: result };
    } catch (error) {
      return { status: statusCode.BAD_GATEWAY, message: error.message };
    }
  }

  async getOrderByIdAndUserDeatils(orderId){
    try {
      const order = await orderRepository.getOrderByIdAndUserDeatils(orderId);
      return { status: statusCode.OK, message: 'Order Fetched!', data: order };
    } catch (error) {
      return { status: statusCode.BAD_GATEWAY, message: error.message };
    }
  }

}

export default new OrderService();
