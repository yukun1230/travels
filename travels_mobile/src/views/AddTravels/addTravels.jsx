import {
  Text,
  View,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { THEME_BACKGROUND, THEME_LABEL, THEME_TEXT } from '../../assets/CSS/color';
import React, { useState, useEffect } from 'react';
import Button from 'apsl-react-native-button';
import FormItem from './components/formItem';
import UnLoginScreen from '../../components/unLogin';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { NGROK_URL } from '../../config/ngrok';
import '../../util/axios.config';
import { useSelector, useDispatch } from 'react-redux';
import { setUser, clearUser } from '../../redux/userSlice';
import LoadingOverlay from '../../components/LoadingOverlay';


export default addTravelsScreen = () => {
  // 数组来保存图片uri
  const [image, setImage] = useState([]);
  // 数组用于传到后端
  const [file, setFile] = useState([]);
  // 数组用于存储图片的长度和宽度
  const [dimension, setDimension] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [height, setHeight] = useState(0);
  const userInfo = useSelector(state => state.user); // 获取保存的用户信息
  // 选取图片，异步操作

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,  // 所有多媒体文件
      // allowsEditing: true,  // 是否允许编辑，和图片多选是矛盾的
      allowsMultipleSelection: true,
      // aspect: [1, 1],  // 编辑比例
      quality: 0.5,  // 图片质量
    });
    let uri_image = []; // 图像uri，用于回显
    let myform = [];    // 用于存数据库，图片信息uri、name、type
    let mydimension = [];  // 用于存图片尺寸
    if (!result.canceled) {
      for (let i = 0; i < result.assets.length; i++) {
        let uri = result.assets[i].uri;
        let uriArr = uri.split('/');
        let name = uriArr[uriArr.length - 1];
        let width = result.assets[i].width;
        let height = result.assets[i].height;
        uri_image.push(result.assets[i].uri);
        myform.push({
          uri,
          name,
          type: 'image/jpeg',
        });
        mydimension.push({
          name,
          width,
          height
        })
      }
      setImage([...image, ...uri_image]); // 头像回显
      setFile([...file, ...myform])  // 用于发送到后端,图片信息uri、name、type
      setDimension([...dimension, ...mydimension])  // 用于发送到后端，图片的宽度和高度信息
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      content: ''
    },
  });
  // 删除照片操作
  const deletePhoto = async (uri) => {
    let index = image.indexOf(uri);
    let myArray = [...image]
    let fileArray = [...file]
    let dimensionArray = [...dimension]
    myArray.splice(index, 1);
    fileArray.splice(index, 1);
    dimensionArray.splice(index, 1);
    setImage(myArray);
    setFile(fileArray);
    setDimension(dimensionArray);
  }

  const onSubmit = async (data) => {
    let params = new FormData();
    console.log(file);
    // 添加游记的图片
    for (let item of file) {
      params.append('file', item);
    };
    // 添加游记的标题和内容
    for (let i in data) {
      params.append(i, data[i]);
    };
    // 添加图片信息
    for (let i = 0; i < dimension.length; i++) {
      params.append(dimension[i].name, `${dimension[i].width}/${dimension[i].height}`);
    };
    // 添加用户信息
    for (let i in userInfo) {
      params.append(i, userInfo[i]);
    };
    // 添加游记的审核状态
    params.append("travelState", 2); // 0审核未通过，1审核通过，2未审核，3被删除
    console.log("params", params);
    setIsLoading(true);
    axios.post(NGROK_URL + '/travels/upload', params, {
      headers: {
        'Content-Type': 'multipart/form-data' // 告诉后端，有文件上传
      }
    }).then(
      res => {
        // console.log(res.data);
        Alert.alert(res.data.message);
        setIsLoading(false);
      }
    ).catch(
      err => {
        console.log(err);
        setIsLoading(false);
      }
    )
  };
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {!userInfo.id && <UnLoginScreen />}
      {userInfo.id && <View style={styles.aboveAll}>
        <LoadingOverlay isVisible={isLoading} />
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={image.length < 3 ? false : true}//是否允许滚动
          // scrollEnabled={false}
        >
          {image.map(item => (
            <View style={styles.photo_Container} key={item} >
              <TouchableOpacity style={styles.delPhoto} onPress={() => deletePhoto(item)}>
                <Text style={{ color: "white", fontSize: 20, height: 20, marginBottom: 9 }}>×</Text>
              </TouchableOpacity>
              <Image
                source={{ uri: item }}
                style={styles.photo_image}
              />
            </View>
          ))}
          <View style={styles.icon}>
            <TouchableOpacity  //添加游记的图标
              onPress={pickImage}
            >
              <Text style={styles.plus_Text}>+</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <FormItem
          required
          name="title"
          control={control}
          errors={errors.title}
          rules={{
            required: '不能为空',
            // pattern: {
            //   value: /^[a-zA-Z0-9_-]{4,16}$/,
            //   message: '用户名格式校验错误,应为4到16位(字母,数字,下划线,减号)',
            // },
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholderTextColor="#ccc"
              style={styles.titleInput}
              placeholder='填写标题更容易上精选'
            />
          )}
          style={{ height: 40, marginBottom: 20 }}
        />
        <View>
          <FormItem
            required
            control={control}
            name="content"
            rules={{
              required: '不能为空',
              // pattern: {
              //   value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/,
              //   message: '密码格式校验错误,应为8到16位(大小写字母和数字)',
              // },
            }}
            errors={errors.content}
            render={({ field: { onChange, value } }) => (
              <View style={{ height: Math.max(200, height) }}>
                <TextInput
                  style={[styles.contentInput, { height: Math.max(200, height) }]}
                  value={value}
                  multiline  //设置多行
                  numberOfLines={6} //行数为5
                  textAlignVertical="top"
                  placeholderTextColor="#ccc"
                  autoCapitalize="none"
                  onContentSizeChange={(e) => setHeight(e.nativeEvent.contentSize.height)}
                  onChangeText={(text) => {
                    onChange(text);
                  }}
                  placeholder="第一张图片会自动成为你的“封面”，竖图美照更受欢迎哟！"
                />
              </View>
            )}
          />
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <Button style={styles.submit_Button} textStyle={{ fontSize: 18, color: "white" }} onPress={handleSubmit(onSubmit)}>发布</Button>
          </View>
        </View>
      </View>}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  aboveAll: {
    paddingLeft: 15,
    paddingRight: 15,
    marginTop: 20
  },
  aboveTitle: {
    textAlign: 'center',
    fontSize: 50,
    color: THEME_LABEL
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: '500',
    color: THEME_LABEL,
    textAlign: 'center',
    marginTop: 32,
    marginBottom: 32
  },
  submit_Button: {
    flex: 1,
    backgroundColor: '#2196F3',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 60,
    height: 35,
    borderRadius: 10,
    borderColor: "#2196F3"
  },
  subButton: {
    marginTop: 15,
    marginRight: 15,
    marginLeft: 15,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  subButtonText: {
    color: "#1500EF",
    fontSize: 14,
  },
  titleInput: {
    flex: 1,
    fontSize: 20,
    height: 40,
    fontWeight: "600",
    paddingLeft: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc"
  },
  abovePhoto: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  photo_Container: {
    width: 98,
    height: 98,
    borderRadius: 9,
    borderWidth: 1,
    position: "relative",
    // justifyContent: 'center',
    alignItems: 'flex-end',
    borderColor: '#B3BAC1',
    marginTop: 10,
    marginRight: 10,
  },
  delPhoto: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    position: 'absolute',
    zIndex: 1,
    width: 22,
    height: 22,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 9,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    width: 100,
    height: 100,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#B3BAC1',
    marginTop: 10
  },
  contentInput: {
    fontSize: 20,
    padding: 10,
    paddingBottom: 10,
  },
  plus_Text: {
    color: '#B3BAC1',
    fontSize: 60
  },
  photo_image: {
    width: 96,
    height: 96,
    borderRadius: 8
  }
});