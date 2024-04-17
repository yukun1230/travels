// 用户相关接口
const express = require('express');
var UsersRouter = express.Router();
const { User } = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const app = express();
const SECRET = 'yukun';
app.use(express.json());
const userController = require('../controllers/UserController')
// 获取用户信息
UsersRouter.get('/', (req, res) => {
  console.log('req对象')
})

// 登录接口
UsersRouter.post('/login', async (req, res) => {
  const user = await User.findOne({
    username: req.body.username
  }, { username: 1, password: 1, avatar: 1, nickname: 1 })
  // 这里真滴搞，不加{password：1}获取的文档(document)里面居然都没有password一项，怕不是被默认不返回了？
  if (!user) {
    return res.send({
      message: "用户名不存在"
    })
  } else {
    bcrypt.compare(
      req.body.password,
      user.password,
      (err, isValid) => {
        if (!!isValid) {
          const token = jwt.sign({
            id: String(user._id),
          }, SECRET, { expiresIn: "0.5d" }) // 设置token失效时间为半天
          res.header("Authorization", token)  // token放在请求头中
          res.send({
            message: "登录成功",
            user,  // 用户信息不一定要返回，里面包含密码的密文
          })
        } else {
          res.send({
            message: "密码错误"
          })
        }
      }
    );
  }
})

// 一个中间件,用于验证token
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

UsersRouter.get('/getUserInfo', auth, async (req, res) => {
  if (!!req.user) {
    const userInfo = await User.findById(req.user._id, '_id username nickname avatar collectTravels likeTravels gender introduction').exec()
    res.send(userInfo);
  } else {
    res.send({ message: 'token无效' })
  }
})

// 测试接口，用于上传头像
UsersRouter.post('/upload/avatar', userController.upload)

// 用于更新用户信息
UsersRouter.post('/update', userController.update)

// 注册接口
UsersRouter.post('/register', userController.register)

module.exports = UsersRouter
