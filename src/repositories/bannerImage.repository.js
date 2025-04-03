import BannerImage from '../models/BannerImage.js';

class BannerImageRepository {

  async getAll( ) {
    return BannerImage.findAll();
  }

  async save(bannerData) {
    return BannerImage.create(bannerData);
  }

  async findById(id){
    return BannerImage.findByPk(id);
  }
  
  async remove(id) {
    const bannerData = await this.findById(id);
    if(bannerData) {
        await BannerImage.destroy({ where: {id} })
    }
    return null;
  }
}

export default new BannerImageRepository();