import categoryService from '../services/category.service.js';
import { statusCode } from "../utils/statusCode.js";

class CategoryController {

  async createCategory(req, res) {
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    const { name } = req.body;
    const data = { name, image: imagePath }
    console.log(data);
    try {
      const result = await categoryService.createCategory(data);
      return res.status(result.status).json({ message: result.message, category: result.data });
    } catch (error) {
      return res.status(error.status).json({ error: error.message });
    }
  }

  async getAllCategories(req, res) {
    try {
      const result = await categoryService.getAllCategories();
      return res.status(result.status).json({ message: result.message, category: result.data });
    } catch (error) {
      return res.status(error.status).json({ error: error.message });
    }
  }

  async deleteCategory(req, res) {
    try {
      const result = await categoryService.deleteCategory(req.params.id);
      if (result.status !== statusCode.OK){
        return res.status(statusCode.NOT_FOUND).json({ message: result.message });
      }
      return res.status(result.status).json({ message: result.message })
    } catch (error) { 
      return res.status(statusCode.BAD_GATEWAY).json({ error: error.message });
    }
  }

  async updateCategory(req, res) {
    try {
      const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
      const { name } = req.body;
      console.log(req.body);
      const existingCategory = await categoryService.getCategoryById(req.params.id);
        if (!existingCategory) {
            return res.status(statusCode.NOT_FOUND).json({ message: "Category Not Found" });
        }

        // If no new image is uploaded, retain the existing one
        if (!imagePath) {
            imagePath = existingCategory.image;
        }
      const data = { name, image: imagePath }
      console.log(data);
      const result = await categoryService.updateCategory(req.params.id, data);
      res.status(statusCode.OK).json({ message: result.message, category: result.data });
    } catch (error) {
      res.status(statusCode.BAD_GATEWAY).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const id  = req.params.id
      const result = await categoryService.getById(id);
      return res.status(result.status).json({ message: result.message, category: result.data });
    } catch (error) {
      return res.status(error.status).json({ error: error.message });
    }
  }


}

export default new CategoryController();
