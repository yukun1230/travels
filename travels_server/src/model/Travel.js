const mongoose = require('../db/mongodb')

// 建立游记表(结构)
const TravelScheme = new mongoose.Schema({
  photo: [{ // 游记照片
    uri: String,
    height: Number,
    width: Number
  }],
  title: String, // 游记标题
  content: {  // 游记内容
    type: String,
    required: true
  },
  location: {
    country: String,
    province: String,
    city: String
  },
  travelState: Number,
  userId: String,
  userInfo: {
    nickname: String,
    avatar: String
  },
  rejectedReason: String,
  createTime: {  // 游记创建时间
    type: Date,
    default: Date.now
  },
  updateTime: {  // 游记更新时间
    type: Date,
    default: Date.now
  },
  collectedCount: Number,
  likedCount: Number
})

const Travel = mongoose.model('Travel', TravelScheme)  // 将结构编译成模型
module.exports = { Travel }  // Travel是一个模型，还可以添加更多模型