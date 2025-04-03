import addressService from '../services/address.service.js';
import { statusCode } from "../utils/statusCode.js";

class AddressController {

  async getAddressesByUserId(req, res) {
    try {
      const addressData = await addressService.getAddressesByUserId(req.user.id);
      return res.status(addressData.status).json({ addressData });
    } catch (error) {
      return res.status(error.status || statusCode.BAD_GATEWAY).json({ error: error.message });
    }
  }

  async createAddress(req, res) {
    try {
      const userId = req.user.id
      const addressData = {...req.body , userId}
      const data = await addressService.createAddress(addressData);
      return res.status(data.status).json({ addressdata: data.data });
    } catch (error) {
      return res.status(error.status || statusCode.BAD_GATEWAY).json({ error: error.message });
    }
  }

  async updateAddress(req, res) {
    try {
      const result = await addressService.updateAddress(req.params.id, req.body);
      if (result.status !== statusCode.OK) {
        return res.status(statusCode.NOT_FOUND).json({ message: result.message });
      }
      return res.status(statusCode.OK).json({ message: result.message, addressData: result.data });
    } catch (error) {
      return res.status(statusCode.BAD_GATEWAY).json({ error: error.message });
    }
  }

  async deleteAddress(req, res) {
    try {
      const result = await addressService.deleteAddress(req.params.id);
      if (result.status !== statusCode.OK) {
        return res.status(statusCode.NOT_FOUND).json({ message: result.message });
      }
      return res.status(statusCode.OK).json({ message: result.message });
    } catch (error) {
      return res.status(statusCode.BAD_GATEWAY).json({ error: error.message });
    }
  }

}

export default new AddressController();
