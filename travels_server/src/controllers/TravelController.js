const { uploadMultiPhoto } = require('../multer/upload');
const { Travel } = require('../model/Travel');
const { User } = require('../model/User');

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
      const travels = await Travel.find({ travelState: { $eq: 1 } }, '_id photo title userInfo collectedCount likedCount').sort({ '_id': -1 }).skip(page * pageSize).limit(pageSize)
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
  // mobile--- 由用户的token获取获取用户发布的游记(用于我的游记), travelState为3和4的不返回
  async getMyTravels(req, res) {
    try {
      const MyTravels = await Travel.find({ userId: req.user._id, travelState: { $nin: [3, 4] } }, '_id photo title content travelState location rejectedReason').sort({ travelState: -1, _id: -1 }).exec();
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
          photo: [...newPhotoArray.photodata, ...uploadRes],
          travelState: 2, // 游记状态改为待审核
          rejectedReason: "" // 清空拒绝原因
        }
      })
      res.send({ message: "更新成功" });
    } catch (e) {
      console.log("更新失败")
    }
  }
  async getCollectedTravels(req, res) {
    const result = [];
    const userInfo = await User.findById(req.user._id, 'collectTravels').exec()
    if (userInfo.collectTravels) {
      for (let i = 0; i < userInfo.collectTravels.length; i++) {
        result.unshift(await Travel.findById(userInfo.collectTravels[i], '_id photo title content userInfo'))
      }
      res.send({
        message: "获取成功",
        result: result
      })
    } else {
      res.send({
        message: "没有收藏的游记"
      })
    }
  }
  async getlikedTravels(req, res) {
    const result = [];
    const userInfo = await User.findById(req.user._id, 'likeTravels').exec()
    if (userInfo.likeTravels) {
      for (let i = 0; i < userInfo.likeTravels.length; i++) {
        result.unshift(await Travel.findById(userInfo.likeTravels[i], '_id photo title content userInfo'))
      }
      res.send({
        message: "获取成功",
        result: result
      })
    } else {
      res.send({
        message: "没有点赞的游记"
      })
    }
  }
  async getDraftTravels(req, res) {
    try {
      const MyTravels = await Travel.find({ userId: req.user._id, travelState: { $eq: 4 } }, '_id photo title content travelState location').sort({ travelState: -1, _id: -1 }).exec();
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
  async search(req, res) {
    const myQuery = new RegExp(req.query.query, 'i');
    await Travel.find({
      $or: [
        { "title": myQuery },
        { "userInfo.nickname": myQuery },
        { "location.country": myQuery },
        { "location.province": myQuery },
        { "location.city": myQuery }
      ],
      travelState: { $eq: 1 }
    }).then((data) => {
      res.send({
        code: 200,
        msg: '查询成功',
        data
      })
    }).catch((e) => {
      console.log(e)
      res.send({
        code: 500,
        msg: '查询失败'
      })
    })
  }
  async collectTravel(req, res) {
    try {
      await User.findOneAndUpdate({ _id: req.user._id }, { $push: { collectTravels: req.body.travelId } });
      await Travel.findOneAndUpdate({ _id: req.body.travelId }, { $inc: { collectedCount: 1 } })
      res.send({ message: "收藏成功" })
    } catch (e) {
      res.send({ message: "收藏失败" })
    }
  }
  async UndoCollectTravel(req, res) {
    try {
      await User.findOneAndUpdate({ _id: req.user._id }, { $pull: { collectTravels: req.body.travelId } });
      await Travel.findOneAndUpdate({ _id: req.body.travelId }, { $inc: { collectedCount: -1 } })
      res.send({ message: "取消收藏成功" })
    } catch (e) {
      res.send({ message: "取消收藏失败" })
    }
  }
  async likeTravel(req, res) {
    try {
      await User.findOneAndUpdate({ _id: req.user._id }, { $push: { likeTravels: req.body.travelId } });
      await Travel.findOneAndUpdate({ _id: req.body.travelId }, { $inc: { likedCount: 1 } });
      res.send({ message: "点赞成功" })
    } catch (e) {
      res.send({ message: "点赞失败" })
    }
  }
  async UndoLikeTravel(req, res) {
    try {
      await User.findOneAndUpdate({ _id: req.user._id }, { $pull: { likeTravels: req.body.travelId } });
      await Travel.findOneAndUpdate({ _id: req.body.travelId }, { $inc: { likedCount: -1 } })
      res.send({ message: "取消点赞成功" })
    } catch (e) {
      res.send({ message: "取消点赞失败" })
    }
  }
}

module.exports = new TravelController()