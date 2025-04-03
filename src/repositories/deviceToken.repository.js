import DeviceToken from "../models/DeviceToken.js";
import User from "../models/User.js";

const DeviceTokenRepository = {

  async saveToken(userId, token) {
    const existingToken = await DeviceToken.findOne({ where: { userId } });
    if (existingToken) {
      await DeviceToken.destroy({ where: { userId } });
    }
    return await DeviceToken.upsert({ userId, token });
  },

  async getTokensByUserId(userId) {
    return await DeviceToken.findAll({ where: { userId } });
  },

  async getAllTokens() {
    return await DeviceToken.findAll();
  },

  async getTokensByAdminId(userId) {
    const admin = await User.findOne({
      where: { id: userId, role: "admin"},
      include: {
        model: DeviceToken,
        attributes: ["token"]
      }
    })
    if (!admin) {
      throw new Error("Admin not found or does not have permission");
    }
    return admin.DeviceTokens.map((token) => token.token)
  },

  async getAllAdminTokens() {
    const admins = await User.findAll({
      where: { role: "admin" },
      include: {
        model: DeviceToken,
        attributes: ["token"],
      },
    });

    return admins.map(admin => ({
      id: admin.id, 
      tokens: admin.DeviceTokens.map(token => token.token),
  }));
  }
};

export default DeviceTokenRepository;
