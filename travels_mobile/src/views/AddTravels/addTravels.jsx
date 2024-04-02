import {
  Text,
  View,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { THEME_BACKGROUND, THEME_LABEL, THEME_TEXT } from '../../assets/CSS/color';
import React, { useState, useEffect } from 'react';
import Button from 'apsl-react-native-button';
import FormItem from './components/formItem';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { NGROK_URL } from '../../config/ngrok'
import '../../util/axios.config'


export default addTravelsScreen = () => {
  // 数组来保存图片
  const [image, setImage] = useState([]);
  // 选取图片
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,  // 所有多媒体文件
      // allowsEditing: true,  // 是否允许编辑
      allowsMultipleSelection: true,
      // aspect: [1, 1],  // 编辑比例
      quality: 0.3,  // 图片质量
    });
    if (!result.canceled) {
      let uri = [];
      for (let i = 0; i < result.assets.length; i++) {
        // console.log(result.assets[i])
        uri.push(result.assets[i].uri);
      }
      // let uriArr = uri.split('/');
      // let name = uriArr[uriArr.length - 1];
      setImage([...image, ...uri]); // 用于头像回显
      // setFile({
      //   file: {
      //     uri,
      //     name,
      //     type: 'image/jpeg',
      //   }
      // })
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
  const deletePhoto = async (uri) => {
    // console.log(uri)
    let index = image.indexOf(uri);
    let myArray = image
    if (index !== -1) {
      myArray.splice(index, 1);
    }
    // console.log(myArray)
    setImage(myArray)
    console.log(image)
  }

  useEffect(() => {
    // 在状态变化后手动触发重新渲染
    // 这将确保渲染结果能够及时更新
    console.log('Image state has changed:', image);
  }, [image]);

  const onSubmit = async (data) => {
    // axios.post(NGROK_URL + '/users/login', data).then(
    //   res => {
    //     Alert.alert(res.data.message);
    //     console.log(res.data)
    //   }
    // )
    console.log(data)
  };
  return (
    <View style={styles.aboveAll}>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {image.map(item => (
          <View style={styles.photo_Container} key={item.id} >
            <TouchableOpacity style={styles.delPhoto} onPress={() => deletePhoto(item)}>
              <Text style={{ color: "white", fontSize: 20 }}>×</Text>
            </TouchableOpacity>
            <Image
              source={{ uri: item }}
              style={styles.photo_image}
            />
          </View>
        ))}

        <TouchableOpacity  //添加游记的图标
          style={styles.icon}
          onPress={pickImage}
        >
          <Text style={styles.plus_Text}>+</Text>
        </TouchableOpacity>
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
          <View style={{ height: 200 }}>
            <TextInput
              style={[styles.contentInput, { height: 200 }]}
              value={value}
              multiline  //设置多行
              numberOfLines={6} //行数为5
              textAlignVertical="top"
              placeholderTextColor="#ccc"
              autoCapitalize="none"
              onChangeText={(text) => {
                onChange(text);
              }}
              placeholder="第一张图片会自动成为你的“封面”，竖图美照更受欢迎哟！"
            />
          </View>
        )}
      />
      <View style={{ flexDirection: "row", marginTop: 10 }}>
        <Button style={styles.login_Button} textStyle={{ fontSize: 18, color: "white" }} onPress={handleSubmit(onSubmit)}>发布</Button>
      </View>
    </View>
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
  login_Button: {
    flex: 1,
    backgroundColor: '#2196F3',
    marginLeft: 10,
    marginRight: 10,
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
    borderRadius: 10,
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
    width: 25,
    height: 25,
    borderRadius: 8,
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
    marginTop: 10,
    marginRight: 10,
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