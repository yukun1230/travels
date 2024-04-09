const { uploadMultiPhoto } = require('../multer/upload');
const { Travel } = require('../model/Travel');

class TravelController {
  // 游记信息图片+标题+内容+地点 上传
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
        },
        collectedCount: req.body.collectedCount,
        collectedCount: req.body.likedCount,
      })
      await travel.save();  // 更新文档
      res.send({ message: "上传成功" });
    } catch (error) {
      res.send("上传失败")
    }
  }
  // mobile---分页获取获取所有游记信息(用于首页展示) 
  async getTravels(req, res) {
    try {
      const page = req.query.page - 1;
      const pageSize = req.query.pageSize;
      console.log(req.query.page)
      // 这里之后再加个筛选条件，只返回审核通过后的游记
      // const travels = await Travel.find({travelState: 1}, '_id photo title userInfo').skip(page * pageSize).limit(pageSize)
      const travels = await Travel.find({}, '_id photo title userInfo collectedCount likedCount').sort({'_id':-1}).skip(page * pageSize).limit(pageSize)
      res.send({
        message: "获取游记信息成功",
        travels
      })
    } catch (e) {
      res.send(e)
    }
  }
  // mobile---由游记的id获取获取游记信息的详情(用于首页的详情页)  
  async getDetails(req, res) {
    try {
      const travelDetail = await Travel.findById(req.query.id).exec();
      res.send({
        message: "获取游记详情成功",
        travelDetail
      })
    } catch (e) {
      res.send(e)
    }
  }
  // mobile--- 由游记id逻辑删除某条游记(需要带上用户的token)，用户只能删除自己的游记，即travelState改为3
  async deleteOneTravel(req, res) {
    try {
      await Travel.findOneAndUpdate({ _id: req.body.id }, { travelState: 3 })
      res.send({
        message: "删除成功",
      })
    } catch (e) {
      res.send({
        message: "删除失败",
      })
    }
  }
  // mobile--- 由用户的token获取获取用户发布的游记(用于我的游记), travelState为3的不返回
  async getMyTravels(req, res) {
    try {
      const MyTravels = await Travel.find({ userId: req.user._id, travelState: { $ne: 3 } }, '_id photo title content travelState location rejectedReason').exec();
      if (MyTravels) {
        res.send({
          message: "获取我的游记成功",
          MyTravels
        })
      } else {
        res.send({
          message: "未获取到游记",
        })
      }
    } catch (e) {
      res.send(e)
    }
  }
  async updateOneTravel(req, res) {
    try {
      const uploadRes = await uploadMultiPhoto(req, res)  // 上传新添加的图片
      const newPhotoArray = JSON.parse(req.body.photo)
      await Travel.findOneAndUpdate({ _id: req.body.id }, {
        $set: {
          title: req.body.title,
          content: req.body.content,
          location: JSON.parse(req.body.location),
          photo: [...newPhotoArray.photodata, ...uploadRes]
        }  // 这里需要拼接一下
      })
      res.send({ message: "更新成功" });
    } catch (e) {
      console.log("更新失败")
    }
  }
}

module.exports = new TravelController()