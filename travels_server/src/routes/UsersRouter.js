// 用户相关接口
const express = require('express');
var UsersRouter = express.Router();
const { User } = require('../model/User');
const bcypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const app = express();
// 图片上传
// const multer = require('multer');
// const upload = multer({ dest: 'public/avatarUploads/' })
const SECRET = 'yukun';
app.use(express.json());
const userController = require('../controllers/UserController')

// 获取用户信息
UsersRouter.get('/', (req, res) => {
  console.log('req对象')
  res.send('爱你哟，倩颖!')
})

// 登录接口
UsersRouter.post('/login', async (req, res) => {
  const user = await User.findOne({
    username: req.body.username
  }, { username: 1, password: 1 })
  // 这里真滴搞，不加{password：1}获取的文档(document)里面居然都没有password一项，怕不是被默认不返回了？
  if (!user) {
    return res.send({
      message: "用户名不存在"
    })
  } else {
    bcypt.compare(
      req.body.password,
      user.password,
      (err, isValid) => {
        if (!!isValid) {
          const token = jwt.sign({
            id: String(user._id),
          }, SECRET, { expiresIn: "0.5d" }) // 设置token失效时间为30秒
          return res.send({
            message: "登录成功",
            user,
            token: token
          })
        } else {
          return res.send({
            message: "密码无效"
          })
        }
      }
    );
  }
})

// 注册接口
// UsersRouter.post('/register', upload.single('file'), async (req, res) => {
//   try {
//     console.log(req)
//     const user = await User.create({
//       username: req.body.username,
//       nickname: req.body.nickname,
//       password: req.body.password,
//       avatar: req.file
//     })
//     console.log(user.avatar)
//     await user.save();  // 更新文档
//     res.send("注册成功");
//   }
//   catch (e) {
//     console.log(e)
//     res.send({ message: "用户名已存在" });
//   }
// })

// UsersRouter.post('/uploadAvater', upload.single('file'), async (req, res) => {
//   res.send({
//     code: 200,
//     data: {
//       ...req.file,
//       filename: 'upload/' + req.file.filename
//     },
//     message: '上传成功',
//   })
// })
UsersRouter.post('/upload/avatar', userController.upload)

// UsersRouter.post('/register', userController.register)

module.exports = UsersRouter
