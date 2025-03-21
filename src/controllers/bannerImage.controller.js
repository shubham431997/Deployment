import bannerImageService from '../services/bannerImage.service.js';
import { statusCode } from "../utils/statusCode.js";

class BannerImageController {

  async getAllBannerImages(req, res) {
    try {
      const bannerData = await bannerImageService.getAllBannerImages();
      return res.status(bannerData.status).json({ bannerData: bannerData });
    } catch (error) {
      return res.status(error.status).json({ error: error.message });
    }
  }

  async createBannerImage(req, res) {
    try {
      const imagePath = req.file ? req.file.path : null;
      const bannerData = { image: imagePath };
      const data = await bannerImageService.createBannerImage(bannerData);
      return res.status(data.status).json({bannerData: data });
    } catch (error) {
      return res.status(error.status).json({ error: error.message });
    }
  }

  async deleteBannerImage(req,res){
    try {
        const result = await bannerImageService.deleteBannerImage(req.params.id);
        if(result.status !== statusCode.OK){//isuues occurs here because of status
              return res.status(statusCode.NOT_FOUND).json({ message : result.message});
        }
          return res.status(statusCode.OK).json({ message : result.message ,})
      } catch (error) {
            return res.status(statusCode.BAD_GATEWAY).json({ error: error.message });
        }
  }


}

export default new BannerImageController();
