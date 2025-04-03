import CartRepository from "../repositories/cart.repository.js";
import { statusCode } from "../utils/statusCode.js";

class CartService {
  async addToCart(userId, productId, quantity, weightNprice = []) {
    try {
      const cartItem = await CartRepository.addItemToCart(
        userId,
        productId,
        quantity,
        weightNprice
      );
      return {
        status: statusCode.OK,
        data: cartItem,
        message: "Item added to cart successfully.",
      };
    } catch (error) {
      return {
        status: statusCode.BAD_GATEWAY,
        message: "Failed to add item to cart.",
        error,
      };
    }
  }

  async bulkAddToCart(userId, products) {
    try {
      const cartItems = await CartRepository.bulkAddItemsToCart(
        userId,
        products
      );
      return {
        status: statusCode.OK,
        data: cartItems,
        message: "Items added to cart successfully.",
      };
    } catch (error) {
      return {
        status: statusCode.BAD_GATEWAY,
        message: "Failed to add items to cart.",
        error,
      };
    }
  }

  async getCart(userId) {
    try {
      const cartItems = await CartRepository.getCartByUserId(userId);
      // if (cartItems.length === 0) {
      //   return { status: 404, message: 'Items not available in Cart.' };
      // }
      return {
        status: statusCode.OK,
        data: cartItems,
        message: "Cart fetched successfully.",
      };
    } catch (error) {
      return {
        status: statusCode.BAD_GATEWAY,
        message: "Failed to fetch cart.",
        error,
      };
    }
  }

  async clearCart(userId) {
    try {
      await CartRepository.clearCart(userId);
      return { status: statusCode.OK, message: "Cart cleared successfully." };
    } catch (error) {
      return {
        status: statusCode.BAD_GATEWAY,
        message: "Failed to clear cart.",
        error,
      };
    }
  }

  async updateCartItem(cartId, updateData) {
    try {
      const updated = await CartRepository.updateCartItem(cartId, updateData);
      if (updated[0] === 0) {
        return {
          status: statusCode.NOT_FOUND,
          message: "Cart item not found.",
        };
      }
      return {
        status: statusCode.OK,
        message: "Cart item updated successfully.",
      };
    } catch (error) {
      return {
        status: statusCode.BAD_GATEWAY,
        message: "Failed to update cart item.",
        error,
      };
    }
  }

  async removeCartItem(cartId) {
    try {
      const deleted = await CartRepository.removeItemFromCart(cartId);
      if (!deleted) {
        return {
          status: statusCode.NOT_FOUND,
          message: "Cart item not found.",
        };
      }
      return {
        status: statusCode.OK,
        message: "Cart item removed successfully.",
      };
    } catch (error) {
      return {
        status: statusCode.BAD_GATEWAY,
        message: "Failed to remove cart item.",
        error,
      };
    }
  }
}

export default new CartService();
