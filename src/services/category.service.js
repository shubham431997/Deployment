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

  async updateCategory(id,data){
    try {
        const getData = await CategoryRepository.getById(id);
        if (!getData) {
            return { status: statusCode.NOT_FOUND, message: "Category Not Found" };
        }
        const updatedCategory = await CategoryRepository.update(id, data);
        return { status: statusCode.OK, message: "Category Updated Succesfully.", data: updatedCategory };
    } catch (error) {
        return { status: statusCode.BAD_GATEWAY, message: error.message };
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
