// 引入 mongoose 
const mongoose = require('mongoose')

// 连接数据库，自动新建 ExpressApi 库
mongoose.connect('mongodb://127.0.0.1:27017/Travels')

module.exports = mongoose