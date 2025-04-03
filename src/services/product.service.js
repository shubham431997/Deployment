import Category from '../models/Category.js';
import ProductRepository from '../repositories/product.repository.js';
import { statusCode } from "../utils/statusCode.js";

class ProductService {

  async getAllProducts(categoryId) {
    try {
        const product =  await ProductRepository.getAll(categoryId,{include:[
          {model: Category
         //  attributes: ["name"]
          }
        ]});
        return { status: statusCode.OK, message: 'All products Shows Succesfully', data: product  }
    } catch (error) {
        throw { status: statusCode.BAD_GATEWAY, message: error.message }
    }
  }

  async getAll() {
    try {
        const product =  await ProductRepository.getAllProducts();
        return { status: statusCode.OK, message: 'All products Shows Succesfully', data: product  }
    } catch (error) {
        throw { status: statusCode.BAD_GATEWAY, message: error.message }
    }
  }

  async createProduct(productData) {
    try {
        const product = await ProductRepository.save(productData);
        return { status: statusCode.OK, message: 'Product Created.....!', data: product  }
    } catch (error) {
        throw { status: statusCode.BAD_GATEWAY, message: error.message }
    }
  }

  async updateProduct(id, productData) {
    try {
      const getData = await ProductRepository.findById(id);
      if (!getData) {
          return { status: statusCode.NOT_FOUND, message: "Product Not Found" };
      }
      const updatedProduct = await ProductRepository.update(id, productData);
      return { status: statusCode.OK, message: "Product Updated Succesfully.", data: updatedProduct };
    } catch (error) {
      return { status: statusCode.BAD_GATEWAY, message: error.message };
    }
  }


  async getProductById(id) {
    try {
      const product = await ProductRepository.findById(id);
      if(!product)
          return { status: statusCode.NOT_FOUND, message: "Product Not Found"};
      return { status: statusCode.OK, message: "Product Found" , data: product};
      
    } catch (error) {
      return { status: statusCode.BAD_GATEWAY, message: error.message };
    }
  }

  async deleteProduct(id){
    try {
        const result =  await ProductRepository.findById(id);
        if(!result)
            return { status: statusCode.NOT_FOUND, message: "Product Not Found"};
        await ProductRepository.remove(id);
        return { status: statusCode.OK, message: "Product Deleted Successfully" };
    } catch (error) {
        throw { status: statusCode.BAD_GATEWAY, message: error.message }
    }
  }
}

export default new ProductService();
