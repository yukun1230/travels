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
    console.log(req.headers.token)
    const { id } = jwt.verify(req.headers.token, SECRET);  // 这个操作需要时间
    req.user = await User.findById(id, { username: 1, avatar: 1, nickname: 1 });
    next();
  } catch (e) {
    next();
  }
}

// mobile---分页获取获取所有游记信息(用于首页展示) 
TravelsRouter.get('/getTravels', travelController.getTravels)

// mobile---由游记的id获取获取游记信息的详情(用于首页的详情页)
TravelsRouter.get('/getDetails', travelController.getDetails)

// mobile---由游记id,逻辑删除某条游记(需要带上用户的token)，用户只能删除自己的游记，即travelState改为3
TravelsRouter.post('/deleteOneTravel', auth, travelController.deleteOneTravel)

// mobile---由用户的token获取获取用户发布的游记(用于我的游记), travelState为3的不返回
TravelsRouter.get('/getMyTravels', auth, travelController.getMyTravels)

// mobile---游记上传接口
TravelsRouter.post('/upload', travelController.upload)


// web---分页获取所有游记信息(用于PC端审核) 
TravelsRouter.get('web/getTravels', async (req, res) => {
  try {
    const page = req.query.page - 1;
    const pageSize = req.query.pageSize;
    // 这里之后再加个筛选条件，不返回被逻辑删除的游记
    // const travels = await Travel.find({travelState: {$ne: 3}}, '_id photo title userInfo createTime').skip(page * pageSize).limit(pageSize)
    const travels = await Travel.find({}, '_id photo title userInfo createTime').skip(page * pageSize).limit(pageSize)
    res.send({
      message: "获取游记信息成功",
      travels
    })
  } catch (e) {
    res.send(e)
  }
})


module.exports = TravelsRouter