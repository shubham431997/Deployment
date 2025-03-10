import DeviceToken from "../models/DeviceToken.js";

const DeviceTokenRepository = {
  async saveToken(userId, token) {
    return await DeviceToken.upsert({ userId, token });
  },

  async getTokensByUserId(userId) {
    return await DeviceToken.findAll({ where: { userId } });
  },

  async getAllTokens() {
    return await DeviceToken.findAll();
  },
};

export default DeviceTokenRepository;
