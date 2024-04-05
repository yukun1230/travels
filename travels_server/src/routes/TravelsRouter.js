// 游记相关接口
const express = require('express');
const multer = require('multer');
const { Travel } = require('../model/Travel');
const { User } = require('../model/User');
var TravelsRouter = express.Router();
const jwt = require("jsonwebtoken");
const SECRET = 'yukun';

const travelController = require('../controllers/TravelController')
// 获取所有游记信息(用于首页展示)
TravelsRouter.get('/getTravels', async (req, res) => {
  try {
    const page = req.query.page - 1;
    const pageSize = req.query.pageSize;
    console.log(req.query.page)
    // console.log(req.query)
    // 这里之后再加个筛选条件，只返回审核通过后的游记
    const travels = await Travel.find({},'_id photo title userInfo').skip(page*pageSize).limit(pageSize)
    res.send({
      message: "获取游记信息成功",
      travels
    })
  } catch (e) {
    res.send(e)
  }
})

// 由游记的id获取获取游记信息的详情(用于首页的详情页)
TravelsRouter.get('/getDetails', async (req, res) => {
  try {
    const travelDetail = await Travel.findById(req.query.id).exec();
    res.send({
      message: "获取游记详情成功",
      travelDetail
    })
  } catch (e) {
    res.send(e)
  }
})

// 一个中间件,用于验证token
const auth = async (req, res, next) => {
  try {
      console.log(req.headers.token)
      const { id } = jwt.verify(req.headers.token, SECRET);  // 这个操作需要时间
      req.user = await User.findById(id, { username: 1, avatar: 1,nickname: 1});
      next();
  } catch (e) {
    next();
  }
}


// 由用户的token获取获取用户发布的游记(用于我的游记)
TravelsRouter.get('/getMyTravels', auth, async (req, res) => {
  try {
    // let newMyTravels
    const MyTravels = await Travel.find({userId: req.user._id},'_id photo title content travelState').exec();
    for (let i = 0; i < MyTravels.length; i++) {
      let newMyTravels = MyTravels[i].photo[0];
      MyTravels[i].photo = newMyTravels
    }
    res.send({
      message: "获取我的游记成功",
      MyTravels
    })
  } catch (e) {
    res.send(e)
  }
})


// 游记上传接口
TravelsRouter.post('/upload', travelController.upload)

// 游记更新接口
// TravelsRouter.post('/update', multer({ dest: 'uploads' }).array('file', 10), (req, res) => {
//   console.log(req.body);
//   res.send(req.files);
// })



module.exports = TravelsRouter