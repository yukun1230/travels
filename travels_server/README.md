# 项目介绍

这部分是旅游日记平台后端的相关内容，



# 项目技术栈

- `Node.js`
- `express`
- `multer`
- `mongoose`
- `jsonwebtoken`
- `bcrypt`

# 接口说明(部分)

## 用户相关

### [post] `users/login`  

移动端的登录接口，使用了`bcrypt`模块的`compare`方法来比较用户输入的密码和数据库中存储的加密密码是否匹配，如果密码匹配，则生成一个JSON Web Token (JWT)。该令牌包含用户的ID，并使用密钥`SECRET`进行签名。然后将令牌设置到响应头的`Authorization`字段中，并返回一个JSON对象，包含成功登录的消息和用户信息。

```javascript
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
    bcypt.compare(
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
```

### 一个中间件—`auth`，用于验证token有效性

一个中间件，用于验证`token`的有效性。如果验证`token`成功，则将用户信息添加到请求对象中，并调用`next()`函数，以便后续的中间件或路由处理器可以访问用户信息。如果验证失败或发生异常，则直接调用`next()`函数，以便继续执行下一个中间件或路由处理器，但在这种情况下，请求对象中将不包含用户信息。

中间件相关代码如下：

```javascript
const auth = async (req, res, next) => {
  try {
    const { id } = jwt.verify(req.headers.token, SECRET); 
    req.user = await User.findById(id, { username: 1, avatar: 1, nickname: 1 });
    next();
  } catch (e) {
    next();
  }
}
```

### [get] `users/getUserInfo`

获取用户信息的接口代码如下所示，使用了中间件`auth`，当`token`验证通过之后，利用`token`解析出来的用户`_id`去数据库中取出全部的用户信息，用于移动端用户信息的展示。

```javascript
UsersRouter.get('/getUserInfo', auth, async (req, res) => {
  if (!!req.user) {
    const userInfo = await User.findById(req.user._id, '_id nickname avatar collectTravels likeTravels').exec()
    res.send(userInfo);
  } else {
    res.send({ message: 'token无效' })
  }
})
```

### [post]`users/register`

用于注册的接口，头像上传是采用中间件`multer`实现的。

```javascript
// 注册接口
UsersRouter.post('/register',   async register(req, res) {
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
})

function uploadAvatar(req, res) {
  return new Promise((resolve, reject) => {
    singleUploadMiddleware.single('file')(req, res, function (err) {  // 单文件
      if (err) {
        console.log("图片上传出错了");
        reject(err) // 传递的图片格式错误或者超出文件限制大小，就会reject出去
      } else {
        console.log("图片上传成功"); 
        const img = req.file.filename.split('.') // 拼接成完整的服务器静态资源图片路径
        resolve({
          id: req.body.username,
      // 重新返回符合规定的图片链接地址. img[0]是文件名，img[1]是后缀名,req.body.username是用户名
          img_url: BaseURL + imgPath_avatar + img[0] + '.' + img[1]
        })
      }
    }
    )
  })
}
```

## 游记相关

### [get]`travels/getTravels`

### [get]`travels/getDetails`

### [post]`travels/deleteOneTravel`

### [get]`travels/getMyTravels`

### [get]`travels/getCollectedTravels`



# 项目启动

1. 进入项目目录`cd travels_server`
2. 安装依赖`npm install`
3. 启动项目`npm run start`

# 运行说明

由于前端是通过expo沙盒环境搭建的，运行于expo client，而后端是运行于`localhost:3000`端口的，前端发送`http`请求到`localhost:3000`是无效的，为了解决这个问题，本项目采用了`ngrok` 服务，将`localhost:3000`端口映射到外网，前端就可以通过发送`http`请求到这个外网地址，间接访问到本机的`localhost:3000`端口。

如果希望项目能够在自己的电脑上运行，前端需要更改`travels_mobile/src/config/ngrok.js`文件夹里的`NGROK_URL`字段的值。后端需要更改`travels_server/src/multer/upload`中的`BaseURL`字段的值。将这些值替换为被映射的外网地址。