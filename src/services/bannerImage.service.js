import BannerImage from '../models/BannerImage.js';
import bannerImageRepository from '../repositories/bannerImage.repository.js';
import { statusCode } from "../utils/statusCode.js";

class BannerImageService {

  async getAllBannerImages() {
    try {
        const bannerData =  await bannerImageRepository.getAll();
        return { status: statusCode.OK, message: 'All baneers are shown successfully', data: bannerData  }
    } catch (error) {
        throw { status: statusCode.BAD_GATEWAY, message: error.message }
    }
  }

  async createBannerImage(bannerData) {
    try {
        const data = await bannerImageRepository.save(bannerData);
        return { status: statusCode.OK, message: 'Banner Image Created.....!', data: data  }
    } catch (error) {
        return { status: statusCode.BAD_GATEWAY, message: error.message }
    }
  }

  async deleteBannerImage(id){
    try {
        const result =  await bannerImageRepository.findById(id);
        if(!result)
            return { status: statusCode.NOT_FOUND, message: "BannerImage Not Found"};
        await bannerImageRepository.remove(id);
        return { status: statusCode.OK, message: "BannerImage Deleted Successfully" };
    } catch (error) {
        throw { status: statusCode.BAD_GATEWAY, message: error.message }
    }
  }
}

export default new BannerImageService();
