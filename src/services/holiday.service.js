import holidayRepository from '../repositories/holiday.repository.js';
import { statusCode } from "../utils/statusCode.js";

class HolidayService {
  
  async createHoliday(holidayData) {
    try {
      const newHoliday = await holidayRepository.createHoliday(holidayData);
      return { status: statusCode.OK, message: 'Holiday created successfully', data: newHoliday };
    } catch (error) {
      return { status: statusCode.BAD_GATEWAY, message: error.message };
    }
  }

  async getAllHolidays() {
    try {
      const holidays = await holidayRepository.getAllHolidays();
      return { status: statusCode.OK, message: 'All holidays fetched successfully', data: holidays };
    } catch (error) {
      throw { status: statusCode.BAD_GATEWAY, message: error.message };
    }
  }

  async updateHoliday(id, holidayData) {
    try {
      const holiday = await holidayRepository.getHolidayById(id);
      if (!holiday) return { status: statusCode.NOT_FOUND, message: "Holiday not found" };
      
      const updatedHoliday = await holidayRepository.updateHoliday(id, holidayData);
      return { status: statusCode.OK, message: "Holiday updated successfully", data: updatedHoliday };
    } catch (error) {
      throw { status: statusCode.BAD_GATEWAY, message: error.message };
    }
  }

  async deleteHoliday(id) {
    try {
      const holiday = await holidayRepository.getHolidayById(id);
      if (!holiday) return { status: statusCode.NOT_FOUND, message: "Holiday not found" };
      
      await holidayRepository.deleteHoliday(id);
      return { status: statusCode.OK, message: "Holiday deleted successfully" };
    } catch (error) {
      throw { status: statusCode.BAD_GATEWAY, message: error.message };
    }
  }
}

export default new HolidayService();
