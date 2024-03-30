var createError = require('http-errors');
var express = require("express");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const UsersRouter = require('./src/routes/UsersRouter');
const TravelsRouter = require('./src/routes/TravelsRouter');
const cors = require('cors')
const app = express();

// 开启跨域支持
app.use(cors())
// view engine setup
app.set('views', path.join(__dirname, 'views')); // 设置在哪一个路径下查找模板文件
app.set('view engine', 'jade'); // 设置模板的后缀名
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/public/', express.static('./public/')) // 设置public文件夹为静态文件
app.use('/users', UsersRouter);  // 注册路由
app.use('/travels', TravelsRouter); 

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// 全局中间件---错误处理
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;