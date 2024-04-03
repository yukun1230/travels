const {uploadMultiPhoto} = require('../multer/upload');
const { Travel } = require('../model/Travel');

class TravelController {
  // 游记照片上传
  async upload(req, res) {
    // console.log(req)
    try {
      const uploadRes = await uploadMultiPhoto(req, res)
      console.log(uploadRes)
      res.send({
        meta: { code: 200, msg: '上传成功！' },
        data: { img_url: uploadRes }
      })
    } catch (error) {
      res.send(error)
    }
  }
  // async register(req, res) {
  //   // console.log(req.body)
  //   try {
  //     // 报错了，但是无法catch到
  //     const uploadRes = await uploadMultiPhoto(req, res);
  //     let user = await User.create({
  //       username: req.body.username,
  //       nickname: req.body.nickname,
  //       password: req.body.password,
  //       avatar: uploadRes.img_url
  //     })
  //     // console.log(user)
  //     console.log(uploadRes)
  //     // user.avatar = uploadRes
  //     await user.save();  // 更新文档
  //     res.send("注册成功");
  //   }
  //   // res.send({ message: "头像图片大小超过限制2M" });
  //   catch (e) {
  //     if(e.message === 'File too large') {
  //       res.send({ message: "头像图片超出2M的限制" });
  //     } else {
  //       res.send({message: "用户名已存在"})
  //     }
      
  //   }
  // }
}

module.exports = new TravelController()