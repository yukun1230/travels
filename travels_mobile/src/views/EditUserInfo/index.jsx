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
import FormItem from './components/formItem';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { NGROK_URL } from '../../config/ngrok';
import '../../util/axios.config';  // 拦截器相关
import { useSelector, useDispatch } from 'react-redux';
import { Picker } from '@react-native-picker/picker';
import { AntDesign } from '@expo/vector-icons';
import { Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';


export default EditUserInfoScreen = () => {

  const pickImage = async () => {

  };
  const { control, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      nickname: '',
      introduction: ''
    },
  });

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ marginTop: '10%', alignSelf: 'center' }}>
        <TouchableOpacity
          onPress={pickImage}>
          <Image
            source={{ uri: "https://5b0988e595225.cdn.sohucs.com/images/20171114/bc48840fb6904dd4bd8f6a8af8178af4.png" }}
            style={{ width: 130, height: 130, borderRadius: 65 }}
          />
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: '8%' }}>
        {/* 信息项 */}
        <View style={styles.infoItem}>
          {/* <Text style={{ fontSize: 20, flex: 1 }}>昵称:</Text> */}
          <FormItem
            required
            name="nickname"
            control={control}
            errors={errors.nickname}
            rules={{
              required: '不能为空',
              // pattern: {
              //   value: /^[a-zA-Z0-9_-]{4,16}$/,
              //   message: '用户名错误,请输入4到16位字符(字母,数字,下划线,减号)',
              // },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                style={styles.Input}
              // placeholder='请输入您的用户名'
              />
            )}
            style={{ marginBottom: 20 }}
          />
        </View>
        <View style={styles.infoItem}>
          <Text style={{ fontSize: 20 }}>其他:</Text>
          <TextInput style={{ fontSize: 20, marginLeft: '5%' }}>123</TextInput>
        </View>
      </View>

      {/* <View style={{marginTop:'8%'}}>
        <Text>
          123
        </Text>
      </View> */}

    </View>



  )
}



const styles = StyleSheet.create({
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopColor: 'grey',
    width: '80%',
    alignSelf: 'center',
    backgroundColor: "yellow",
    padding: 15
  },
  Input: {
    flex: 1,
    fontSize: 20,
    height: 40,
    paddingLeft: 10,
    // borderBottomColor: THEME_TEXT
  }
});