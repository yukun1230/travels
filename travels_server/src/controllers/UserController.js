const { uploadAvatar, updateAvatar } = require('../multer/upload')
const { User } = require('../model/User');
const { Travel } = require('../model/Travel');
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
  async update(req, res) {
    try {
      const updateRes = await updateAvatar(req, res);
      console.log(updateRes);
      await User.findOneAndUpdate({ _id: req.body.id }, {
        $set: {
          nickname: req.body.nickname,
          introduction: req.body.introduction,
          gender: req.body.gender,
          avatar: updateRes ? updateRes : req.body.avatar
        }
      })
      // 更新游记中的userInfo
      const myUserInfo = await User.findById({_id: req.body.id}, 'nickname avatar');
      console.log(myUserInfo)
      await Travel.updateMany({userId: req.body.id}, {
          userInfo: {nickname: myUserInfo.nickname, avatar: myUserInfo.avatar}
      })


      res.send({ message: "更新成功" });
    } catch (error) {
      console.log(error)
      res.send({ message: "更新失败" });
    }
  }
  async register(req, res) {
    try {
      const uploadRes = await uploadAvatar(req, res);  //上传头像
      let user = await User.create({
        username: req.body.username,
        nickname: req.body.nickname,
        password: req.body.password,
        avatar: uploadRes.img_url
      })
      await user.save();
      res.send("注册成功");
    }
    catch (e) {
      if (e.message === 'File too large') {
        res.send({ message: "头像图片超出2M的限制" });
      } else {
        res.send({ message: "用户名已存在" })
      }
    }
  }
}


module.exports = new UserController()