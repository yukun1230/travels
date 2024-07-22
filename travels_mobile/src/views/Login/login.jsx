import { Text, View, TextInput, StyleSheet, TouchableWithoutFeedback, ImageBackground, StatusBar } from 'react-native';
import { THEME_LABEL, THEME_TEXT } from '../../assets/CSS/color';
import React, { useState, useEffect } from 'react';
import Button from 'apsl-react-native-button';
import FormItem from './components/formItem';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { NGROK_URL } from '../../config/ngrok'
import '../../util/axios.config'
import { getToken } from '../../util/tokenRelated'
import { useDispatch } from 'react-redux'
import { setUser } from '../../redux/userSlice';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
export default LoginScreen = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(0)  //密码框输入显隐控制
  const dispatch = useDispatch();
  const handleregister = () => navigation.navigate("注册界面");
  const handleVisit = () => navigation.navigate("主界面");
  const handleClear = () => {
    setValue('username', '');
    setValue('password', '');
  }
  const { control, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      username: '',
      password: ''
    },
  });
  const onSubmit = async (data) => {
    // 提交信息验证，登录
    await axios.post(NGROK_URL + '/users/login', data).then(
      res => {
        if (res.data.message === "登录成功") {
          Toast.show({
            type: 'success',
            text1: res.data.message,
            position: 'top',
            autoHide: true,
            visibilityTime: 1000,
          })
        } else {
          Toast.show({
            type: 'error',
            text1: res.data.message,
            position: 'top',
            autoHide: true,
            visibilityTime: 1000,
          })
        }
        const { _id, avatar, nickname } = res.data.user;
        // 使用 dispatch 将用户信息保存到 Redux
        dispatch(setUser({
          id: _id,
          avatar: avatar,
          nickname: nickname,
        }));
        handleVisit()
      }
    )
  };



  useEffect(() => {
    // 如果有Token，直接跳转首页
    const checkTokenAndRedirect = async () => {
      const token = await getToken();
      if (token) {
        axios.get(NGROK_URL + '/users/getUserInfo', { headers: { 'token': token } })
          .then(res => {
            if (res.data._id) {
              navigation.navigate("主界面");
            }
          })
          .catch(err => {
            console.error(err);
          });
      }
    };
    checkTokenAndRedirect();
  }, []);

  return (
    <KeyboardAwareScrollView style={{ flex: 1 }} behavior="padding" showsVerticalScrollIndicator={false} scrollEnabled={false}>
      <StatusBar backgroundColor="#E7F2EF" barStyle='dark-content' />
      <ImageBackground source={require("../../../assets/home_background_two.png")} resizeMode="cover"
        style={{ flex: 1}}
      >
        <View style={styles.loginSection}>
          <Text style={styles.aboveTitle}> </Text>
          <Text style={styles.loginTitle}> </Text>
          <FormItem
            required
            name="username"
            control={control}
            errors={errors.username}
            rules={{
              required: '不能为空',
              pattern: {
                value: /^[a-zA-Z0-9_-]{4,16}$/,
                message: '用户名错误,请输入4到16位字符(字母,数字,下划线,减号)',
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
                message: '密码格式错误,请输入8到16位密码(大小写字母和数字)',
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
                  {showPassword ?
                    <Ionicons name="eye-outline" size={24} color="grey" style={{ alignSelf: 'center', marginRight: 10 }} /> :
                    <Ionicons name="eye-off-outline" size={24} color="grey" style={{ alignSelf: 'center', marginRight: 10 }} />
                  }
                </TouchableWithoutFeedback>
              </View>
            )}
            style={{ marginBottom: 20 }}
          />
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <Button style={styles.login_Button} textStyle={{ fontSize: 18, color: "white" }} onPress={handleSubmit(onSubmit)}>登录</Button>
            <Button style={styles.login_Button} textStyle={{ fontSize: 18, color: "white" }} onPress={handleClear}>重置 </Button>
          </View>
          <View style={styles.subButton}>
            <Text style={styles.subButtonText} onPress={handleregister}>新用户注册</Text>
            <Text style={styles.subButtonText} onPress={handleVisit}>以游客身份访问</Text>
          </View>
        </View>
      </ImageBackground>
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  loginSection: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    marginTop: 110,
    marginBottom: 355,
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