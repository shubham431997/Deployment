import Order from "../models/Order.js";
import User from "../models/User.js";

class OrderRepository {
  async createOrder(orderData) {
    return await Order.create({
      userId: orderData.userId,
      cartItems: orderData.cartItems,
      total: orderData.total,
      deliveryFee: orderData.deliveryFee,
      grandTotal: orderData.grandTotal,
      address: orderData.address,
      payment_mode: orderData.payment_mode,
      payment_id: orderData.payment_id,
      status: orderData.status,
      invoiceId: orderData.invoiceId
    });
  }

  async updateOrder(orderId, status) {
    if (!orderId) {
      return { status: false, message: "Order ID is required!" };
    }
    const [updated] = await Order.update(
      { status },
      { where: { id: orderId } }
    );
    if (updated === 0) {
      return { status: false, message: "Order not found!" };
    }
    const updatedOrder = await this.getOrderById(orderId);
    return { status: true, data: updatedOrder };
  }

  async getOrderById(orderId) {
    return await Order.findByPk(orderId);
  }

  async deleteOrder(orderId) {
    return await Order.destroy({ where: { id: orderId } });
  }
  
  async getUserOrders(userId) {
    return await Order.findAll({
      where: { userId },
    });
  }

  async getAllOrders() {
    return await Order.findAll({
      include: [{
        model: User,
        attributes: [ 'name']
      }]
    });
  }

  async getOrderByIdAndUserDeatils(orderId) {
    return await Order.findByPk(orderId, {
        include: [
            {
                model: User,
                attributes: ['id', 'name', 'email', 'phone']
            }
        ]
    });
 }

}

export default new OrderRepository();
