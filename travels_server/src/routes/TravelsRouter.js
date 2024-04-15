// 游记相关接口
const express = require('express');
const { Travel } = require('../model/Travel');
const { User } = require('../model/User');
var TravelsRouter = express.Router();
const jwt = require("jsonwebtoken");
const SECRET = 'yukun';
const travelController = require('../controllers/TravelController')

// mobile---一个中间件,用于验证token
const auth = async (req, res, next) => {
  try {
    // console.log(req.headers.token)
    const { id } = jwt.verify(req.headers.token, SECRET);  // 这个操作需要时间
    req.user = await User.findById(id, { username: 1, avatar: 1, nickname: 1 });
    next();
  } catch (e) {
    return res.send({message:"token过期了~"});
    // next();
  }
}

// mobile---分页获取获取所有游记信息(用于首页展示) 
TravelsRouter.get('/getTravels', travelController.getTravels);

// mobile---由游记的id获取获取游记信息的详情(用于首页的详情页)
TravelsRouter.get('/getDetails', travelController.getDetails);

// mobile---由游记id,逻辑删除某条游记(需要带上用户的token)，用户只能删除自己的游记，即travelState改为3
TravelsRouter.post('/deleteOneTravel', auth, travelController.deleteOneTravel);

// mobile---由用户的token获取用户发布的游记(用于我的游记), travelState为3的不返回
TravelsRouter.get('/getMyTravels', auth, travelController.getMyTravels);

// mobile---通过token获取用户收藏的游记信息
TravelsRouter.get('/getCollectedTravels', auth, async (req, res) => {
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
});

// mobile---通过token获取用户点赞的游记信息
TravelsRouter.get('/getlikedTravels', auth, async (req, res) => {
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
});

// mobile---通过token获取用户存于草稿箱的游记信息
TravelsRouter.get('/getDraftTravels', auth, async (req, res) => {
  try {
    const MyTravels = await Travel.find({ userId: req.user._id, travelState: { $eq: 4 } }, '_id photo title content travelState location').sort({travelState: -1}).exec();
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
  } catch(e) {
    res.send(e)
  }
})

// mobile---游记上传接口
TravelsRouter.post('/upload', travelController.upload);

// mobile---游记更新接口
TravelsRouter.post('/updateOneTravel', travelController.updateOneTravel);

// mobile---首页游记搜索
TravelsRouter.get('/search', async (req, res) => {
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
})

// mobile---收藏
TravelsRouter.post('/collectTravel', auth, async (req, res) => {
  try {
    await User.findOneAndUpdate({ _id: req.user._id }, { $push: { collectTravels: req.body.travelId } });
    await Travel.findOneAndUpdate({ _id: req.body.travelId }, { $inc: { collectedCount: 1 } })
    res.send({ message: "收藏成功" })
  } catch (e) {
    res.send({ message: "收藏失败" })
  }
})

// moblie---取消收藏
TravelsRouter.post('/UndoCollectTravel', auth, async (req, res) => {
  try {
    await User.findOneAndUpdate({ _id: req.user._id }, { $pull: { collectTravels: req.body.travelId } });
    await Travel.findOneAndUpdate({ _id: req.body.travelId }, { $inc: { collectedCount: -1 } })
    res.send({ message: "取消收藏成功" })
  } catch (e) {
    res.send({ message: "取消收藏失败" })
  }
})

// mobile---点赞
TravelsRouter.post('/likeTravel', auth, async (req, res) => {
  try {
    await User.findOneAndUpdate({ _id: req.user._id }, { $push: { likeTravels: req.body.travelId } });
    await Travel.findOneAndUpdate({ _id: req.body.travelId }, { $inc: { likedCount: 1 } });
    res.send({ message: "点赞成功" })
  } catch (e) {
    res.send({ message: "点赞失败" })
  }
})

// moblie---取消点赞
TravelsRouter.post('/UndoLikeTravel', auth, async (req, res) => {
  try {
    await User.findOneAndUpdate({ _id: req.user._id }, { $pull: { likeTravels: req.body.travelId } });
    await Travel.findOneAndUpdate({ _id: req.body.travelId }, { $inc: { likedCount: -1 } })
    res.send({ message: "取消点赞成功" })
  } catch (e) {
    res.send({ message: "取消点赞失败" })
  }
})

// web---分页获取所有游记信息(用于PC端审核) 
TravelsRouter.get('/web/getTravels', async (req, res) => {
  try {
    const page = req.query.page - 1;
    const pageSize = req.query.pageSize;
    const beginDate = req.query.beginDate;
    const endDate = req.query.endDate;
    const title = req.query.title;
    const travelState = req.query.travelState;
    let findCon = { travelState: { $nin: [3,4] } };
    if (title) {
      findCon.title = new RegExp(title, 'i');
    }
    if (beginDate) { //endDate
      findCon.createTime = { $lte: new Date(endDate), $gte: new Date(beginDate) };
    }
    if (travelState) {
      findCon.travelState = { $nin: [3,4], $eq: travelState };
    }
    // const customOrder = [2, 0, 1];// 2是待审核，0是拒绝，1是通过,3是被删除，4是草稿
    const travels = await Travel.find(findCon, '_id photo title content travelState userInfo createTime rejectedReason')
      .sort({ travelState: -1, _id: -1 })
      .skip(page * pageSize).limit(pageSize)
    res.send({
      message: "获取游记信息成功",
      quantity: await Travel.countDocuments(findCon),
      travels
    })
  } catch (e) {
    console.log(e)
  }
})

// web---通过游记(用于PC端审核) 
TravelsRouter.post('/web/passOneTravel', async (req, res) => {
  try {
    await Travel.findOneAndUpdate({ _id: req.body.id }, { travelState: 1 })
    res.send({
      message: "设置游记审核通过成功",
    })
  } catch (e) {
    res.send({
      message: "设置游记审核通过失败",
    })
  }
})

// web---设置审核拒绝并且加上原因字段
TravelsRouter.post('/web/rejectOneTravel', async (req, res) => {
  try {
    await Travel.findOneAndUpdate({ _id: req.body.id }, { travelState: 0, rejectedReason: req.body.reason })
    res.send({
      message: "设置游记审核不通过成功",
    })
  } catch (e) {
    res.send({
      message: "设置游记审核拒绝失败",
    })
  }
})

// web---删除游记
TravelsRouter.post('/web/deleteOneTravel', async (req, res) => {
  try {
    await Travel.findOneAndUpdate({ _id: req.body.id }, { travelState: 3 })
    res.send({
      message: "删除游记成功",
    })
  } catch (e) {
    res.send({
      message: "删除游记失败",
    })
  }
})




module.exports = TravelsRouter