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
    return res.send({ message: "token过期了~" });
    // next();
  }
}

// mobile---分页获取获取所有游记信息(用于首页展示) 
TravelsRouter.get('/getTravels', travelController.getTravels);

// mobile---由游记的id获取获取游记信息的详情(用于首页的详情页)
TravelsRouter.get('/getDetails', travelController.getDetails);

// mobile---由游记id,逻辑删除某条游记(需要带上用户的token)，用户只能删除自己的游记，即travelState改为3
TravelsRouter.post('/deleteOneTravel', auth, travelController.deleteOneTravel);

// mobile---由用户的token获取用户发布的游记(用于我的游记), travelState为3和4的不返回
TravelsRouter.get('/getMyTravels', auth, travelController.getMyTravels);

// mobile---通过token获取用户收藏的游记信息
TravelsRouter.get('/getCollectedTravels', auth, travelController.getCollectedTravels);

// mobile---通过token获取用户点赞的游记信息
TravelsRouter.get('/getlikedTravels', auth, travelController.getlikedTravels);

// mobile---通过token获取用户存于草稿箱的游记信息
TravelsRouter.get('/getDraftTravels', auth, travelController.getDraftTravels);

// mobile---游记上传接口
TravelsRouter.post('/upload', travelController.upload);

// mobile---游记更新接口
TravelsRouter.post('/updateOneTravel', travelController.updateOneTravel);

// mobile---首页游记搜索
TravelsRouter.get('/search', travelController.search);

// mobile---收藏
TravelsRouter.post('/collectTravel', auth, travelController.collectTravel);

// moblie---取消收藏
TravelsRouter.post('/UndoCollectTravel', auth, travelController.UndoCollectTravel);

// mobile---点赞
TravelsRouter.post('/likeTravel', auth, travelController.likeTravel);

// moblie---取消点赞
TravelsRouter.post('/UndoLikeTravel', auth, travelController.UndoLikeTravel);

// web---分页获取所有游记信息(用于PC端审核) 
TravelsRouter.get('/web/getTravels', async (req, res) => {
  try {
    const page = req.query.page - 1;
    const pageSize = req.query.pageSize;
    const beginDate = req.query.beginDate;
    const endDate = req.query.endDate;
    const title = req.query.title;
    const travelState = req.query.travelState;
    let findCon = { travelState: { $nin: [3, 4] } };
    if (title) {
      findCon.title = new RegExp(title, 'i');
    }
    if (beginDate) { //endDate
      findCon.createTime = { $lte: new Date(endDate), $gte: new Date(beginDate) };
    }
    if (travelState) {
      findCon.travelState = { $nin: [3, 4], $eq: travelState };
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