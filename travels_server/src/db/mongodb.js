// 引入 mongoose 
const mongoose = require('mongoose')

// 连接数据库，自动新建 ExpressApi 库
// mongoose.connect('mongodb://localhost:27017/Travels')
mongoose.connect('mongodb://116.198.235.72:27017/Travels')

module.exports = mongoose