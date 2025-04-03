import orderRepository from "../repositories/order.repository.js";
import cartRepository from "../repositories/cart.repository.js";
import { statusCode } from "../utils/statusCode.js";
import DeviceTokenRepository from "../repositories/deviceToken.repository.js";
import { sendPushNotification } from "../config/firebase.js";
import notificationService from "./notification.service.js";
import userRepository from "../repositories/user.repository.js";

class OrderService {
  async createOrder(orderData) {
    try {
      const newOrder = await orderRepository.createOrder(orderData);
      await cartRepository.clearCart(orderData.userId);
      const adminList = await DeviceTokenRepository.getAllAdminTokens();
      console.log("---------adminTokens------------", adminList);
      if (adminList.length > 0) {
        const message = {
          title: "New Order Received",
          body: `A new order #${newOrder.id} has been placed.`,
          data: { orderId: newOrder.id },
        };
        for (const admin of adminList) {
          if (admin.tokens.length > 0) {
            await sendPushNotification(admin.tokens, message);
            console.log("===message====", message);
            if (!message.title || !message.body) {
              console.error("Notification data is missing:", message);
              return;
            }
            await notificationService.createNotification(
              admin.id,
              message.title,
              message.body,
              message.data || {}
            );
          }
        }
        // console.log("===message====", message, adminTokens);
        // await sendPushNotification(adminTokens, message);

        // await notificationService.createNotification(
        //   admin.id,
        //   message.title,
        //   message.body,
        //   message.data || {}
        // );
      }
      return {
        status: statusCode.CREATED,
        message: "Order Created Successfully..",
        data: newOrder,
      };
    } catch (error) {
      console.log("error craeting order", error);
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

  async getOrderByIdAndUserDeatils(orderId) {
    try {
      const order = await orderRepository.getOrderByIdAndUserDeatils(orderId);
      return { status: statusCode.OK, message: "Order Fetched!", data: order };
    } catch (error) {
      return { status: statusCode.BAD_GATEWAY, message: error.message };
    }
  }
}

export default new OrderService();
