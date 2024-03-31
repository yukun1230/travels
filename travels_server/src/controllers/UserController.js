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
        data: { img_url: uploadRes }
      })
    } catch (error) {
      res.send(error)
    }
  }
  async register(req, res) {     
    // console.log(req.body)
    try {
      // 报错了，但是无法catch到
      const uploadRes = await uploadAvatar(req, res);
      let user = await User.create({
        username: req.body.username,
        nickname: req.body.nickname,
        password: req.body.password,
        avatar: uploadRes.img_url
      })
      // console.log(user)
      console.log(uploadRes)
      // user.avatar = uploadRes
      await user.save();  // 更新文档
      res.send("注册成功");
    }
    // res.send({ message: "头像图片大小超过限制2M" });
    catch (e) {
      if(e.message === 'File too large') {
        res.send({ message: "头像图片超出2M的限制" });
      } else {
        res.send({message: "用户名已存在"})
      }
      
    }
  }
}


module.exports = new UserController()