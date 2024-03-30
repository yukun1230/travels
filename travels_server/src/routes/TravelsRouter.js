// 游记

const express = require('express');
var TravelsRouter = express.Router();

// 获取游记信息
TravelsRouter.get('/', (req,res)=>{

})

// 游记上传接口
TravelsRouter.post('/upload', (req,res) => {

})

// 游记更新接口
TravelsRouter.post('/update', (req,res) => {

})

module.exports = TravelsRouter