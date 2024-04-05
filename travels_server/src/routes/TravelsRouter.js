// 游记相关接口
const express = require('express');
const multer = require('multer');
const { Travel } = require('../model/Travel');
var TravelsRouter = express.Router();
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

// 由游记的id获取获取游记信息的详情(用于详情页)
TravelsRouter.post('/getDetails', async (req, res) => {
  try {
    const travelDetail = await Travel.findById(req.body.id).exec();
    res.send({
      message: "获取游记详情成功",
      travelDetail
    })
  } catch (e) {
    res.send(e)
  }
})


// 游记上传接口
TravelsRouter.post('/upload', travelController.upload)

// 游记更新接口
TravelsRouter.post('/update', multer({ dest: 'uploads' }).array('file', 10), (req, res) => {
  console.log(req.body);
  res.send(req.files);
})



module.exports = TravelsRouter