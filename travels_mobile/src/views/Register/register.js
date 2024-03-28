import React, { useState } from 'react';
import Button from 'apsl-react-native-button'
import { THEME_BACKGROUND, THEME_LABEL, THEME_TEXT } from '../../assets/CSS/color';
import {
  Text,
  View,
  TextInput,
  Alert,
  StyleSheet,
} from 'react-native';
import { useForm } from 'react-hook-form';
import FormItem from './component/formItem';

const usernameRegEx =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

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
      passwordsure: ''
    },
  });
  const [passwordValue, setPasswordValue] = useState('');
  const onSubmit = (data) => {
    Alert.alert('注册成功');
    delete data.passwordsure   // 删除‘确认密码’
    console.log(data)
  };
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>注册界面</Text>
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
          <Input
            value={value}
            onChangeText={(text) => {
              setPasswordValue(text);
              onChange(text);
            }}
            placeholder="8到16位(大小写字母和数字)"
            secureTextEntry
          />
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
                return '两次密码输入需要一致'
              }
            }
          }
        }}
        errors={errors.passwordsure}
        render={({ field: { onChange, value } }) => (
          <Input
            value={value}
            onChangeText={onChange}
            placeholder="请再次输入密码"
            secureTextEntry
          />
        )}
        style={{ marginBottom: 20 }}
      />


      <Button onPress={handleSubmit(onSubmit)}
        style={styles.register_Button}
        textStyle={{ fontSize: 18, color: "white" }}
      >注册</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,  // 居中
    justifyContent: 'center',
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
    borderColor: "#2196F3"
  },
});
