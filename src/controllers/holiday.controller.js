import holidayService from '../services/holiday.service.js';
import { statusCode } from "../utils/statusCode.js";

class HolidayController {

  async createHoliday(req, res) {
    try {
      const data = await holidayService.createHoliday(req.body);
      return res.status(data.status).json({ message:data.message ,holiday: data.data });
    } catch (error) {
      return res.status(error.status || statusCode.BAD_GATEWAY).json({ error: error.message });
    }
  }

  async getAllHolidays(req, res) {
    try {
      const data = await holidayService.getAllHolidays();
      return res.status(data.status).json({ message:data.message, holidays: data.data });
    } catch (error) {
      return res.status(error.status || statusCode.BAD_GATEWAY).json({ error: error.message });
    }
  }

  async updateHoliday(req, res) {
    try {
      const result = await holidayService.updateHoliday(req.params.id, req.body);
      if (result.status !== statusCode.OK) {
        return res.status(statusCode.NOT_FOUND).json({ message: result.message });
      }
      return res.status(statusCode.OK).json({ message: result.message, holiday: result.data });
    } catch (error) {
      return res.status(statusCode.BAD_GATEWAY).json({ error: error.message });
    }
  }

  async deleteHoliday(req, res) {
    try {
      const result = await holidayService.deleteHoliday(req.params.id);
      if (result.status !== statusCode.OK) {
        return res.status(statusCode.NOT_FOUND).json({ message: result.message });
      }
      return res.status(statusCode.OK).json({ message: result.message });
    } catch (error) {
      return res.status(statusCode.BAD_GATEWAY).json({ error: error.message });
    }
  }

}

export default new HolidayController();
