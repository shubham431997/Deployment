import User from "../models/User.js";

class UserRepository {
  async save(data) {
    return await User.create(data);
  }

  async getById(id) {
    return await User.findByPk(id);
  }

  async findByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  async getAll(userId) {
    return await User.findAndCountAll({ where: { userId } });
  }

  async getAllUsers() {
    return await User.findAndCountAll();
  }

  async update(id, data) {
    await User.update(data, { where: { id } });
    return this.getById(id);
  }

  async remove(id) {
    const user = await this.getById(id);
    if (user) {
      await User.destroy({ where: { id } });
    }
    return null;
  }

  async resetPassword(email, password) {
    await User.update({ password }, { where: { email } });
  }

  async getAdmins() {
    return await User.findAll({
      where: { role: "admin" },
    });
  }
}

export default new UserRepository();
