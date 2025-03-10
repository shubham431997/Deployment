import Holiday from '../models/Holiday.js';

class HolidayRepository {
  async createHoliday(holidayData) {
    return await Holiday.create(holidayData);
  }

  async getAllHolidays() {
    return await Holiday.findAll();
  }

  async getHolidayById(id) {
    return await Holiday.findByPk(id);
  }

  async updateHoliday(id, holidayData) {
    const holiday = await Holiday.findByPk(id);
    if (!holiday) return null;
    return await holiday.update(holidayData);
  }

  async deleteHoliday(id) {
    return await Holiday.destroy({ 
        where: { id } 
    });
  }
}

export default new HolidayRepository();
