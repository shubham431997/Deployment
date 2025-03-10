import Address from '../models/Address.js';

class AddressRepository {
  async createAddress(addressData) {
    return await Address.create(addressData);
  }

  async getAddressesByUserId(userId) {
    return await Address.findAll({ where: { userId } });
  }

  async getAddressById(id) {
    return await Address.findByPk(id);
  }

  async updateAddress(id, addressData) {
    const address = await Address.findByPk(id);
    if (!address) return null;
    return await address.update(addressData);
  }

  async deleteAddress(id) {
    return await Address.destroy({ where: { id } });
  }
}

export default new AddressRepository();
