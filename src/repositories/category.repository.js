import Category from "../models/Category.js";

class CategoryRepository {
    async save(data){
        return await Category.create(data);
    }

    async getAll(){
        return await Category.findAndCountAll();
    }

    async getById(id){
        return await Category.findByPk(id);
    }

    async remove(id) {
        const category = await this.getById(id);
        if(category) {
            await Category.destroy({where: {id}})
        }
        return null;
    }

    async update(id, data) {
        await Category.update(data, { where : {id}});
        return this.getById(id);
    }
}

export default new CategoryRepository