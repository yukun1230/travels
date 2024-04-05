const { uploadMultiPhoto } = require('../multer/upload');
const { Travel } = require('../model/Travel');

class TravelController {
  // 游记照片上传
  async upload(req, res) {
    try {
      const uploadRes = await uploadMultiPhoto(req, res)
      let travel = await Travel.create({
        userId: req.body.id,
        nickname: req.body.nickname,
        userInfo: { nickname: req.body.nickname, avatar: req.body.avatar },
        title: req.body.title,
        content: req.body.content,
        travelState: req.body.travelState,
        photo: uploadRes,
        location: {
          country: req.body.country,
          province: req.body.province,
          city: req.body.city
        }
      })
      await travel.save();  // 更新文档
      res.send({ message: "上传成功" });
    } catch (error) {
      res.send("上传失败")
    }
  }
}

module.exports = new TravelController()