const uploadAvatar = require('../multer/upload')
const { User } = require('../model/User');
// 用户的逻辑控制器
class UserController {
  // 头像图片上传
  async upload(req, res) {
    try {
      const uploadRes = await uploadAvatar(req, res)
      res.send({
        meta: { code: 200, msg: '上传成功！' },
        data: { img_url: uploadRes}
      })
    } catch (error) {
      res.send(error)
    }
  }
  // async register(req, res) {
  //   try {
  //     let user = await User.create({
  //       username: req.body.username,
  //       nickname: req.body.nickname,
  //       password: req.body.password
  //     })
  //     const uploadRes = await uploadAvatar(req, res)
  //     user.avatar = uploadRes
  //     await user.save();  // 更新文档
  //     res.send("注册成功");
  //   }
  //   catch (e) {
  //     res.send({ message: "用户名已存在" });
  //     console.log(e)
  //   }
  // }

}

module.exports = new UserController()