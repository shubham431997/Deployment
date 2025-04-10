import CategoryRepository from '../repositories/category.repository.js';
import { statusCode } from "../utils/statusCode.js";

class CategoryService {

  async createCategory(data) {
    try {
        const category = await CategoryRepository.save(data);
        return { status: statusCode.OK, message: 'Category Created', data: category  }
    } catch (error) {
        throw { status: statusCode.BAD_GATEWAY, message: error.message }
    }
  }

  async getAllCategories(){
    try {
        const category =  await CategoryRepository.getAll();
        return { status: statusCode.OK, message: 'All Category Shows Succesfully', data: category  }
    } catch (error) {
        throw { status: statusCode.BAD_GATEWAY, message: error.message }
    }
  }

  async deleteCategory(id){
    try {
        const result =  await CategoryRepository.getById(id);
        if(!result)
            return { status: statusCode.NOT_FOUND, message: "Category Not Found"};
        await CategoryRepository.remove(id);
        return { status: statusCode.OK, message: "Category Deleted Successfully" };
    } catch (error) {
        throw { status: statusCode.BAD_GATEWAY, message: error.message }
    }
  }

  async updateCategory(req, res) {
    try {
      const id = req.params.id;
      const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
      const { name } = req.body;
      console.log(req.body);
      const data = {
        name
      };
      if (imagePath) {
        data.image = imagePath;
      }
      //console.log(data);
      const result = await categoryService.updateCategory(id, data);
      res.status(statusCode.OK).json({ message: result.message, category: result.data });
    } catch (error) {
      res.status(statusCode.BAD_GATEWAY).json({ error: error.message });
    }
  }
  async getById(id){
    try {
        const category =  await CategoryRepository.getById(id);
        return { status: statusCode.OK, message: 'Category Shows Succesfully', data: category  }
    } catch (error) {
        throw { status: statusCode.BAD_GATEWAY, message: error.message }
    }
  }
  
}

export default new CategoryService();
