import Product from '../models/Product.js';

class ProductRepository {

  async getAll(categoryId,options) {
    return Product.findAll({ where:{categoryId}, ...options
    });
  }

  async getAllProducts() {
    return Product.findAndCountAll();
  }

  async findById(id) {
    return Product.findByPk(id);
  }

  async save(productData) {
    return Product.create(productData);
  }

  async update(id, productData) {
      await Product.update(productData, { where: { id } });
      return this.findById(id);
  }

  async remove(id) {
    const product = await this.findById(id);
    if(product) {
        await Product.destroy({where: {id}})
    }
    return null;
  }
}

export default new ProductRepository();
