import addressRepository from '../repositories/address.repository.js';
import { statusCode } from "../utils/statusCode.js";

class AddressService {
  
  async getAddressesByUserId(userId) {
    try {
      const addresses = await addressRepository.getAddressesByUserId(userId);
      return { status: statusCode.OK, message: 'Addresses retrieved successfully', data: addresses };
    } catch (error) {
      throw { status: statusCode.BAD_GATEWAY, message: error.message };
    }
  }

  async createAddress(addressData) {
    try {
      const address = await addressRepository.createAddress(addressData);
      return { status: statusCode.OK, message: 'Address created successfully', data: address };
    } catch (error) {
      return { status: statusCode.BAD_GATEWAY, message: error.message };
    }
  }

  async updateAddress(id, addressData) {
    try {
      const address = await addressRepository.getAddressById(id);
      if (!address) return { status: statusCode.NOT_FOUND, message: "Address not found" };
      
      const updatedAddress = await addressRepository.updateAddress(id, addressData);
      return { status: statusCode.OK, message: "Address updated successfully", data: updatedAddress };
    } catch (error) {
      throw { status: statusCode.BAD_GATEWAY, message: error.message };
    }
  }

  async deleteAddress(id) {
    try {
      const address = await addressRepository.getAddressById(id);
      if (!address) return { status: statusCode.NOT_FOUND, message: "Address not found" };
      
      await addressRepository.deleteAddress(id);
      return { status: statusCode.OK, message: "Address deleted successfully" };
    } catch (error) {
      throw { status: statusCode.BAD_GATEWAY, message: error.message };
    }
  }
}

export default new AddressService();
