// 引入配置好的 multerConfig
const multerConfig = require('./multerConfig')
const fs = require('fs')
// 上传到服务器地址
const BaseURL = 'http://5fvskc9y2ble.xiaomiqiu.com'
// 上传到服务器的目录，小米球
const imgPath = '/public/avatarUploads/'
const path = require('path')
const handlePath = (dir) => {
  return path.join(__dirname, './', dir)
}

// 对图片进行去重删除和重命名
const hanldeImgDelAndRename = (id, filename, dirPath) => {
  // TODO 查找该路径下的所有图片文件
  fs.readdir(dirPath, (err, files) => {
    for (let i in files) {
      // 当前图片的名称
      const currentImgName = path.basename(files[i])
      // 图片的名称数组：[时间戳, id, 后缀]
      const imgNameArr = currentImgName.split('.')

      // TODO 先查询该id命名的文件是否存在，有则删除
      if (imgNameArr[1] === id) {
        const currentImgPath = dirPath + '/' + currentImgName
        fs.unlink(currentImgPath, (err) => { })
      }

      // TODO 根据新存入的文件名(时间戳.jpg)，找到对应文件，然后重命名为: 时间戳.id.jpg
      if (currentImgName === filename) {
        const old_path = dirPath + '/' + currentImgName
        const new_path = dirPath + '/' + imgNameArr[0] + '.' + id + path.extname(files[i])
        // 重命名该文件
        fs.rename(old_path, new_path, (err) => { })
      }
    }
  })
}

// 封装上传图片的接口
function uploadAvatar(req, res) {
  return new Promise((resolve, reject) => {
    multerConfig.single('file')(req, res, function (err) {  // 单文件
      if (err) {
        // 传递的图片格式错误或者超出文件限制大小，就会reject出去
        reject(err)
      } else {
        // 对图片进行去重删除和重命名
        hanldeImgDelAndRename(req.body.username, req.file.filename, handlePath('../../public/avatarUploads'))
        const img = req.file.filename.split('.')
        // 拼接成完整的服务器静态资源图片路径
        resolve({
          id: req.body.username,
          // 重新返回符合规定的图片链接地址. img[0]是文件名，img[1]是后缀名,req.body.username是用户名
          img_url: BaseURL + imgPath + img[0] + '.' + req.body.username + '.' + img[1]
        })
      }
    })
  })
}

module.exports = uploadAvatar