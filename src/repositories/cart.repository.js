import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import sequelize from "../config/database.js";
import { Op } from "sequelize";

class CartRepository {
  async addItemToCart(userId, productId, quantity, weightNprice) {
    let cartItem = await Cart.findOne({ where: { userId, productId } });

    if (cartItem) {
      cartItem.quantity += quantity;

      if (Array.isArray(weightNprice) && weightNprice.length > 0) {
        cartItem.weightNprice = weightNprice;
      }

      await cartItem.save();
    } else {
      // Create a new cart item with weightNprice
      cartItem = await Cart.create({
        userId,
        productId,
        quantity,
        weightNprice,
      });
    }

    return cartItem;
  }

  async bulkAddItemsToCart(userId, products) {
    const cartItems = [];
    for (const product of products) {
      const { productId, quantity, weightNprice } = product;
      let cartItem = await Cart.findOne({ where: { userId, productId } });

      if (cartItem) {
        cartItem.quantity += quantity;
        if (Array.isArray(weightNprice) && weightNprice.length > 0) {
          cartItem.weightNprice = weightNprice;
        }
        await cartItem.save();
      } else {
        cartItem = await Cart.create({
          userId,
          productId,
          quantity,
          weightNprice,
        });
      }
      cartItems.push(cartItem);
    }
    return cartItems;
  }

  async getCartByUserId(userId) {
    return await Cart.findAll({
      where: { userId },
      include: [{ model: Product }],
    });
  }

  async updateCartItem(cartId, updateData) {
    return await Cart.update(updateData, { where: { id: cartId } });
  }

  async removeItemFromCart(cartId) {
    return await Cart.destroy({ where: { id: cartId } });
  }

  async clearCart(userId) {
    return await Cart.destroy({ where: { userId } });
  }

  async getAbandonedCarts(cutoffTime) {
    return await Cart.findAll({
      where: {
        updatedAt: {
          [Op.lte]: cutoffTime,
        },
      },
      attributes: ["userId"],
      group: ["userId"],
    });
  }
}

export default new CartRepository();
