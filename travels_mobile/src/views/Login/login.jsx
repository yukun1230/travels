import {
  Text,
  View,
  TextInput,
  Alert,
  StyleSheet,
  TouchableWithoutFeedback,
  Image
} from 'react-native';
import { THEME_BACKGROUND, THEME_LABEL, THEME_TEXT } from '../../assets/CSS/color';
import React, { useState } from 'react';
import Button from 'apsl-react-native-button';
import FormItem from './components/formItem';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { NGROK_URL } from '../../config/ngrok'
// import AsyncStorage from '@react-native-async-storage/async-storage';
import '../../util/axios.config'
import {storeToken, getToken, removeToken} from '../../util/tokenRelated'
import { useSelector, useDispatch } from 'react-redux'
import { changePage } from '../../../appSlice';

export default LoginScreen = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(0)
  const dispatch = useDispatch();
  const handlelogin = () => {
    // 跳转页面
    
    // getToken
    navigation.navigate("注册界面")
  }
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      password: ''
    },
  });

  const onSubmit = async (data) => {
    // const message = await removeToken()
    // console.log(message)
    axios.post(NGROK_URL + '/users/login', data).then(
      res => {
        Alert.alert(res.data.message);
        console.log(res.data)
      }
    )
  };
  const handleVisit = () => {
    // dispatch(changePage())
    navigation.navigate("主界面")
  }
  return (
    <View style={styles.loginSection}>
      <Text style={styles.aboveTitle}>旅游日记平台</Text>
      <Text style={styles.loginTitle}>用户登录</Text>
      <FormItem
        required
        name="username"
        control={control}
        errors={errors.username}
        rules={{
          required: '不能为空',
          pattern: {
            value: /^[a-zA-Z0-9_-]{4,16}$/,
            message: '用户名格式校验错误,应为4到16位(字母,数字,下划线,减号)',
          },
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            style={styles.loginInput}
            placeholder='请输入您的用户名'
          />
        )}
        style={{ marginBottom: 20 }}
      />
      <FormItem
        required
        control={control}
        name="password"
        rules={{
          required: '不能为空',
          pattern: {
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/,
            message: '密码格式校验错误,应为8到16位(大小写字母和数字)',
          },
        }}
        errors={errors.password}
        render={({ field: { onChange, value } }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TextInput
              style={styles.loginInput}
              value={value}
              onChangeText={(text) => {
                onChange(text);
              }}
              placeholder="请输入您的密码"
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
      <View style={{ flexDirection: "row", marginTop: 10 }}>
        <Button style={styles.login_Button} textStyle={{ fontSize: 18, color: "white" }} onPress={handleSubmit(onSubmit)}>登录</Button>
        <Button style={styles.login_Button} textStyle={{ fontSize: 18, color: "white" }}>重置</Button>
      </View>
      <View style={styles.subButton}>
        <Text style={styles.subButtonText} onPress={handlelogin}>新用户注册</Text>
        <Text style={styles.subButtonText} onPress={handleVisit}>以游客身份访问</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  loginSection: {
    justifyContent: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    marginTop: 150
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
  loginInput: {
    flex: 1,
    fontSize: 20,
    height: 40,
    paddingLeft: 10,
    borderBottomColor: THEME_TEXT
  },
});