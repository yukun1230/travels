const mongoose = require('../db/mongodb')

// 建立游记表(结构)
const TravelScheme = new mongoose.Schema({
  title: {  // 游记标题
    type: String,
    required: true,
    unique: true
  },
  content: {  // 游记内容
    type: String,
    required: true
  }, 
  photo: [{ // 游记照片
    uri: String, 
    height: Number,
    width: Number
  }],
  createTime: {  // 游记创建时间
    type: Date,
    default: Date.now
  },
  updateTime: {  // 游记更新时间
    type: Date,
    default: Date.now
  }
})

const Travel = mongoose.model('Travel', TravelScheme)  // 将结构编译成模型
module.exports = { Travel }  // Travel是一个模型，还可以添加更多模型