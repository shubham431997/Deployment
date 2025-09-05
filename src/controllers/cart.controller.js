import CartService from "../services/cart.service.js";
import NotificationService from '../services/notification.service.js';
import CartRepository from '../repositories/cart.repository.js';

class CartController {
  async addToCart(req, res) {
    try {
      const userId = req.user.id; 
      //console.log(userId);
      const { productId, quantity, weightNprice } = req.body;
      const result = await CartService.addToCart(userId, productId, quantity, weightNprice);
      setTimeout(async () => {
        const cartItems = await CartRepository.getCartByUserId(userId);
        if (cartItems.length > 0) {
          await NotificationService.sendCartNotification(
            userId,
            "🛍️ Your Cart is Waiting!",
            "Your favorite items are still in the cart! Grab them before they’re gone! ⏳"
          );
        }
      }, 5 * 60 * 60 * 1000);
      return res.status(result.status).json({ message: result.message, data: result.data });
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }

  async bulkAddToCart(req, res) {
    try {
      const userId = req.user.id; 
      const { products } = req.body; 

      if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ message: "Invalid products array." });
      }

      const result = await CartService.bulkAddToCart(userId, products);
      return res
        .status(result.status)
        .json({ message: result.message, data: result.data });
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }

  async getCart(req, res) {
    try {
      const userId = req.user.id;
      const result = await CartService.getCart(userId);
      return res
        .status(result.status)
        .json({ message: result.message, data: result.data });
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }

  async updateCartItem(req, res) {
    try {
      const cartId = req.params.id;
      const updateData = req.body;
      const result = await CartService.updateCartItem(cartId, updateData);
      return res.status(result.status).json({ message: result.message });
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }

  async removeCartItem(req, res) {
    try {
      const cartId = req.params.id;
      const result = await CartService.removeCartItem(cartId);
      return res.status(result.status).json({ message: result.message });
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }

  async clearCart(req, res) {
    try {
      const userId = req.user.id;
      const result = await CartService.clearCart(userId);
      return res.status(result.status).json({ message: result.message });
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }
}

export default new CartController();
