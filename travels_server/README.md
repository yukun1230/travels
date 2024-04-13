# 项目介绍

这部分是旅游日记平台的后端服务系统模块。主要介绍采用一些技术栈以及相关的接口说明，以及项目启动方式和运行说明。

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

移动端的登录接口，使用了`bcrypt`模块的`compare`方法来比较用户输入的密码和数据库中存储的加密密码是否匹配，如果密码匹配，则生成一个`JSON Web Token (JWT)`。该令牌包含用户的ID，并使用密钥`SECRET`进行签名。然后将令牌设置到响应头的`Authorization`字段中，并返回一个JSON对象，包含成功登录的消息和用户信息。

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

当请求资源需要验证用户的时候，需要加入中间件auth，用于验证`token`的有效性。如果验证`token`成功，则将用户信息添加到请求对象中，并调用`next()`函数，以便后续的中间件或路由处理器可以访问用户信息。如果验证失败或发生异常，则直接调用`next()`函数，以便继续执行下一个中间件或路由处理器，但在这种情况下，请求对象中将不包含用户信息。

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

## 游记相关(移动端)

### [get]`travels/getTravels`

这是一个用于移动端首页游记展示的接口，分页获取部分游记信息，如游记id、游记标题、游记封面（默认首张图片）、游记发布者的信息等，这部分也做了一个筛选展示，即仅返回审核通过的游记信息。

### [get]`travels/getDetails`

通过读取查询字符串，获得游记的id，利用这个id从数据库中取出对应的游记信息并进行返回。

### [post]`travels/deleteOneTravel`

由游记id逻辑删除某条游记（请求头需要带上用户的token，并且用中间件`auth`进行token验证），即设置`travelState`字段的值为3，用户只能删除自己的游记。

### [get]`travels/getMyTravels`

由用户的token获取用户发布的游记(用于我的游记页面)， `travelState`为3的不返回。

### [get]`travels/getCollectedTravels`

通过token获取用户收藏的游记信息

### [post]`travels/upload`

游记上传接口，利用`multer`中间件进行多文件上传，上传的内容包括：游记图片+游记标题+游记内容+地点信息

### [post]`travels/updateOneTravel`

游记更新接口，用于编辑页面。

### [get]`travels/search`

用于首页搜索游记，利用简单的正则进行字段匹配，匹配源有游记标题、用户昵称、地点位置。

### [post]`travels/collectTravel`

对游记进行收藏操作的接口，这里主要完成两个步骤，其一，通过token获取用户信息，然后利用获取到的用户id进行`findOneAndUpdate`操作，在相关用户的`document`中添加`collectTravels`字段，字段的值为一个数组，数组中保存的是用户收藏的游记的id。其二，操作对应id的游记`document`，添加字段`collectedCount`每次调用这个接口，该字段都会自增。

### [post]`travels/UndoCollectTravel`

对游记进行取消收藏的操作，主要是对于``travels/collectTravel`接口的反操作，不详细赘述了。

### [post]`travels/likeTravel`

与游记收藏接口的原理一样，差别只在于操作的字段，由`collectTravels`和`collectedCount`变为`likeTravels`和`likedCount`。

### [post]`travels/UndoLikeTravel`

对游记进行取消收藏的操作，主要是对于`travels/likeTravel`接口的反操作，不详细赘述了。

## 游记相关(web审核端)

### [get]`/web/getTravels`

不做详细阐述，直接贴代码：

```javascript
TravelsRouter.get('/web/getTravels', async (req, res) => {
  try {
    const page = req.query.page - 1;
    const pageSize = req.query.pageSize;
    const beginDate = req.query.beginDate;
    const endDate = req.query.endDate;
    const title = req.query.title;
    const travelState = req.query.travelState;
    let findCon = { travelState: { $ne: 3 } };
    if (title) {
      findCon.title = new RegExp(title, 'i');
    }
    if (beginDate) { //endDate
      findCon.createTime = { $lte: new Date(endDate), $gte: new Date(beginDate) };
    }
    if (travelState) {
      findCon.travelState = { $ne: 3, $eq: travelState };
    }
    const travels = await Travel.find(findCon, '_id photo title content travelState userInfo createTime rejectedReason')
      .sort({ travelState: -1, _id: -1 })
      .skip(page * pageSize).limit(pageSize)
    res.send({
      message: "获取游记信息成功",
      quantity: await Travel.countDocuments(findCon),
      travels
    })
  } catch (e) {
    console.log(e)
  }
})
```

### [post]`/web/passOneTravel`

通过请求体中的游记id，执行`findOneAndUpdate`操作，把`travelState`字段的值设置为1。

### [post]`/web/rejectOneTravel`

拒绝游记，同时给游记信息添加上`rejectedReason`字段，字段的值为拒绝理由。

### [post]`/web/deleteOneTravel`

删除游记，这里为逻辑删除，即将`travelState`字段的值设置为3。

# 项目启动

前提：电脑上需要安装`mongodb`数据库。

1. 进入项目目录`cd travels_server`
2. 安装依赖`npm install`
3. 启动项目`npm run start`

# 运行说明

由于前端是通过expo沙盒环境搭建的，运行于expo client，而后端是运行于`localhost:3000`端口的，前端发送`http`请求到`localhost:3000`是无效的，为了解决这个问题，本项目采用了`ngrok` 服务，将`localhost:3000`端口映射到外网，前端就可以通过发送`http`请求到这个外网地址，间接访问到本机的`localhost:3000`端口。

如果希望项目能够在自己的电脑上运行，前端需要更改`travels_mobile/src/config/ngrok.js`文件夹里的`NGROK_URL`字段的值。后端需要更改`travels_server/src/multer/upload`中的`BaseURL`字段的值。将这些值替换为被映射的外网地址。