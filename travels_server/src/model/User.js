// 引入mongodb
const mongoose = require('../db/mongodb')
const bcrypt = require('bcrypt')
// 建立用户表(结构)
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  nickname: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    // set(val) {
    //   return bcrypt.hashSync(val, 10)  //加密, 密码在数据库中不应是明文存储
    // },
    select: false
  },
  createTime: {
    type: Date,
    default: Date.now
  },
  updateTime: {
    type: Date,
    default: Date.now
  }
})

const User = mongoose.model('User', UserSchema)  // 将结构编译成模型
module.exports = { User }  // User是一个模型，还可以添加更多模型