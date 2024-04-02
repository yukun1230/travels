import React, { useState } from 'react';
import Button from 'apsl-react-native-button'
import { THEME_BACKGROUND, THEME_LABEL, THEME_TEXT } from '../../assets/CSS/color';
import { NGROK_URL } from '../../config/ngrok'
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import {
  Text,
  View,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  ScrollView
} from 'react-native';
import { useForm } from 'react-hook-form';
import FormItem from './components/formItem';
import LoadingOverlay from '../../components/LoadingOverlay';
import { useNavigation } from '@react-navigation/native'; 

const Input = (props) => {
  return (
    <TextInput
      {...props}
      style={{
        fontSize: 20,
        height: 40,
        paddingLeft: 10,
      }}
    />
  );
};

export default function RegisterScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      nickname: '',
      password: '',
      passwordsure: '',
    },
  });

  const [passwordValue, setPasswordValue] = useState('');
  const [showPassword, setShowPassword] = useState(0)
  const [showPasswordSure, setShowPasswordSure] = useState(0);
  const [image, setImage] = useState(null);
  const [file, setFile] = useState({ file: null })
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation()  

  // 选取图片
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,  // 所有多媒体文件
      allowsEditing: true,  // 是否允许编辑
      aspect: [1, 1],  // 编辑比例
      quality: 0.3,  // 图片质量
    });
    // console.log(result);
    if (!result.canceled) {
      let uri = result.assets[0].uri;
      let uriArr = uri.split('/');
      let name = uriArr[uriArr.length - 1]
      setImage(uri); // 头像回显
      setFile({
        file: {
          uri,
          name,
          type: 'image/jpeg',
        }
      })
    }
  };

  const onSubmit = (data) => {
    
    const params = new FormData();
    delete data.passwordsure   // 删除‘确认密码’
    console.log(NGROK_URL + '/users/register');
    data = { ...file, ...data }
    // console.log(data);
    for (let i in data) {
      params.append(i, data[i]);
    };
    console.log(params)
    setIsLoading(true);
    axios.post(NGROK_URL + '/users/register', params, {
      headers: {
        'Content-Type': 'multipart/form-data' // 告诉后端，有文件上传
      }
    }).then(
      res => {
        console.log(res.data);
        
        if (res.data.message) {
          Alert.alert(res.data.message);
          setIsLoading(false);
          return
        }
        Alert.alert("注册成功")
        setIsLoading(false);
        navigation.navigate('登录界面');
      }
    ).catch(
      err=>{
        console.log(err);
        setIsLoading(false);
      }
      
    )
  };
  return (
    <ScrollView style={styles.wrapper}>
      <LoadingOverlay isVisible={isLoading} />
      <Text style={styles.title}>用户注册</Text>
      <FormItem
        required
        name="username"
        label="用户名"
        control={control}
        errors={errors.username}
        rules={{
          required: '不能为空',
          pattern: {
            value: /^[a-zA-Z0-9_-]{4,16}$/,
            message: '4到16位(字母,数字,下划线,减号)',
          },
        }}
        render={({ field: { onChange, value } }) => (
          <Input
            value={value}
            onChangeText={onChange}
            placeholder="4到16位(字母,数字,下划线,减号)"
          />
        )}
        style={{ marginBottom: 20 }}
      />
      <FormItem
        required
        name="nickname"
        label="昵称"
        control={control}
        errors={errors.nickname}
        rules={{
          required: '不能为空',
          pattern: {
            value: /^((?!\\|\/|:|\*|\?|<|>|\||'|%|@|#|&|\$|\^|&|\*).){1,8}$/,
            message: '1到8位(不包含特殊字符)',
          },
        }}
        render={({ field: { onChange, value } }) => (
          <Input
            value={value}
            onChangeText={onChange}
            placeholder="1到8位(不包含特殊字符)"
          />
        )}
        style={{ marginBottom: 20 }}
      />
      <FormItem
        required
        label="密码"
        control={control}
        name="password"
        rules={{
          required: '不能为空',
          pattern: {
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/,
            message: '8到16位(大小写字母和数字)',
          },
        }}
        errors={errors.password}
        render={({ field: { onChange, value } }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Input
              style={{ flex: 1 }}
              value={value}
              onChangeText={(text) => {
                setPasswordValue(text);
                onChange(text);
              }}
              placeholder="8到16位(大小写字母和数字)"
              secureTextEntry={!showPassword}
            />
            <TouchableWithoutFeedback style={{ marginRight: 10, flex: 1 }} onPress={() => setShowPassword(!showPassword)}>
              {
                showPassword ?
                  <Image source={require('../../../assets/show.png')} style={{ width: 39, height: 26, alignSelf: 'center' }} /> :
                  <Image source={require('../../../assets/unshow.png')} style={{ width: 39, height: 26, alignSelf: 'center' }} />
              }
            </TouchableWithoutFeedback>
          </View>
        )}
        style={{ marginBottom: 20 }}
      />
      <FormItem
        required
        label="确认密码"
        control={control}
        name="passwordsure"
        rules={{
          required: '不能为空',
          validate: {
            value: (text) => {
              if (text === passwordValue) {
                return true
              }
              else {
                return '两次密码输入需要一致        '
              }
            }
          }
        }}
        errors={errors.passwordsure}
        render={({ field: { onChange, value } }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Input
              style={{ flex: 9 }}
              value={value}
              onChangeText={(text) => {
                setPasswordValue(text);
                onChange(text);
              }}
              placeholder="请再次输入密码              "
              secureTextEntry={!showPasswordSure}
            />
            <TouchableWithoutFeedback
              style={{ marginRight: 10, flex: 1 }}
              onPress={() => { setShowPasswordSure(!showPasswordSure) }}
            >
              {showPasswordSure ?
                <Image source={require('../../../assets/show.png')} style={{ width: 39, height: 26, alignSelf: 'center' }} /> :
                <Image source={require('../../../assets/unshow.png')} style={{ width: 39, height: 26, alignSelf: 'center' }} />
              }
            </TouchableWithoutFeedback>
          </View>
        )}
        style={{ marginBottom: 20 }}
      />
      <View style={{ flexDirection: 'row' }}>
        <Text style={{
          fontSize: 20,
          marginBottom: 5,
          fontWeight: '700',
        }}>上传头像</Text>
        <TouchableOpacity
          style={styles.avatar_Container}
          onPress={pickImage}
        >
          {!image && <Text style={styles.plus_Text}>+</Text>}
          {image && <Image source={{ uri: image }} style={styles.avatar_image} />}
        </TouchableOpacity>
      </View>
      <Button onPress={handleSubmit(onSubmit)}
        style={styles.register_Button}
        textStyle={{ fontSize: 18, color: "white" }}
      >注册</Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,  // 居中
    paddingLeft: 15,
    paddingRight: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: '500',
    color: THEME_LABEL,
    textAlign: 'center',
    marginTop: 32,
    marginBottom: 32
  },
  register_Button: {
    backgroundColor: '#2196F3',
    height: 35,
    borderRadius: 10,
    borderColor: "#2196F3",
    marginTop: 20,
    marginBottom: 40
  },
  avatar_Container: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    marginLeft: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#B3BAC1',
    marginTop: 10
  },
  plus_Text: {
    color: '#B3BAC1',
    fontSize: 60
  },
  avatar_image: {
    width: 96,
    height: 96,
    borderRadius: 50
  }
});