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
        photo: uploadRes
      })
      await travel.save();  // 更新文档
      res.send({ message: "上传成功" });
    } catch (error) {
      res.send(error)
    }
  }
}

module.exports = new TravelController()