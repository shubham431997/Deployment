import ProductService from '../services/product.service.js';
import { statusCode } from "../utils/statusCode.js";

class ProductController {

  async getAllProductsByCategoryID(req, res) {
    try {
      const products = await ProductService.getAllProducts(req.params.id);
      return res.status(products.status).json({ message: products.message, products: products.data });
    } catch (error) {
      return res.status(error.status).json({ error: error.message });
    }
  }

  async getAllProducts(req, res) {
    try {
      const products = await ProductService.getAll();
      return res.status(products.status).json({ message: products.message, products: products.data });
    } catch (error) {
      return res.status(error.status).json({ error: error.message });
    }
  }

  async createProduct(req, res) {
    try {
      const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
      const { name, inStock, weightNprice, wishlist, categoryId }= req.body
      const productData = { name,image: imagePath, inStock, weightNprice, wishlist, categoryId  };
      //console.log(productData);
      const product = await ProductService.createProduct(productData);
      return res.status(product.status).json({ message: product.message, product: product.data });
    } catch (error) {
      return res.status(error.status).json({ error: error.message });
    }
  }

  async getProductById(req, res) {
    try {
      const product = await ProductService.getProductById(req.params.id);
      return res.status(product.status).json({ message: product.message, product: product.data });
    } catch (error) {
      return res.status(error.status).json({ error: error.message });
    }
  }

  async updateProduct(req, res) {
    try {
      const productId = req.params.id;
      const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
      const { name, inStock, weightNprice, wishlist, categoryId } = req.body;
      const updatedProductData = {
        name,
        inStock,
        weightNprice,
        wishlist,
        categoryId
      };
      if (imagePath) {
        updatedProductData.image = imagePath;
      }
      const updatedProduct = await ProductService.updateProduct(productId, updatedProductData);
      res.status(statusCode.OK).json({ message: updatedProduct.message, product: updatedProduct.data });
    } catch (error) {
      res.status(statusCode.BAD_GATEWAY).json({ error: error.message });
    }
  }

  async deleteProduct(req,res){
    try {
        const result = await ProductService.deleteProduct(req.params.id);
        if(result.status !== statusCode.OK){//isuues occurs here because of status
              return res.status(statusCode.NOT_FOUND).json({ message : result.message});
        }
          return res.status(statusCode.OK).json({ message : result.message ,})
      } catch (error) {
            return res.status(statusCode.BAD_GATEWAY).json({ error: error.message });
        }
  }
}

export default new ProductController();
