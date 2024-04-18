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
import { setUser } from '../../redux/userSlice';
import LoadingOverlay from '../../components/LoadingOverlay';
import { Picker } from '@react-native-picker/picker';
import { Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default EditUserInfoScreen = () => {
  const [height, setHeight] = useState(0);  // 关于输入文本框高度的选项
  const [selected, setSelected] = useState();
  const [image, setImage] = useState(null);
  const [file, setFile] = useState({ file: null });
  const [isLoading, setIsLoading] = useState(false);
  const userInfo = useSelector(state => state.user); // 获取保存的用户信息
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nickname: userInfo.nickname,
      introduction: userInfo.introduction ? userInfo.introduction : " "
    },
  });

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,  // 所有多媒体文件
      allowsEditing: true,  // 是否允许编辑
      aspect: [1, 1],  // 编辑比例
      quality: 0.3,  // 图片质量
    });
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
  useEffect(() => {
    setSelected(userInfo.gender ? userInfo.gender : "未选")
  }, [])

  const onSubmit = async (data) => {
    setIsLoading(true);
    const params = new FormData();
    if (file.file !== null) {
      data = { ...file, ...data }
    }
    for (let i in data) {
      params.append(i, data[i]);
    };
    params.append("gender", selected);
    params.append("id", userInfo.id);
    params.append("avatar", userInfo.avatar)
    await axios.post(NGROK_URL + '/users/update', params, {
      headers: {
        'Content-Type': 'multipart/form-data' // 告诉后端，有文件上传
      }
    }).then(
      res => {
        Alert.alert(res.data.message);
        dispatch((setUser({
          ...userInfo,
          avatar: file.file !== null ? file.file.uri : userInfo.avatar,
          nickname: data.nickname,
          gender: selected,
          introduction : data.introduction,
        })))
        setIsLoading(false);
        navigation.goBack();
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
      <LoadingOverlay isVisible={isLoading} />
      <Card style={styles.aboveAll}>
        <View style={{ alignSelf: 'center' }}>
          <TouchableOpacity
            onPress={pickImage}>
            <Image
              source={{ uri: image === null ? userInfo.avatar : image }}
              style={{ width: 130, height: 130, borderRadius: 65 }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: '8%', alignSelf: 'center' }}>
          {/* 信息项 */}
          <View style={styles.infoItem}>
            <Text style={[styles.lable, { alignSelf: 'center' }]}>昵称:</Text>
            <FormItem
              required
              name="nickname"
              control={control}
              errors={errors.nickname}
              rules={{
                required: '不能为空',
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  style={styles.nicknameInput}
                  placeholder='请输入您的昵称'
                  textAlignVertical="top"
                  placeholderTextColor="#ccc"
                />
              )}
              style={{ marginBottom: 20 }}
            />
          </View>
          <View style={styles.infoItem}>
            <Text style={[styles.lable, { alignSelf: 'center' }]}>性别:</Text>
            <Picker
              style={{ width: 260, height: 40, fontSize: 20, alignSelf: 'center' }}
              selectedValue={selected}
              onValueChange={(itemValue, itemIndex) =>
                setSelected(itemValue)
              }
            >
              <Picker.Item style={{ fontSize: 20 }} label='未选' value='未选' />
              <Picker.Item style={{ fontSize: 20 }} label='男' value='男' />
              <Picker.Item style={{ fontSize: 20 }} label='女' value='女' />
            </Picker>
          </View>
          <View style={[styles.infoItem, { height: Math.max(80, height) }]}>
            <Text style={styles.lable}>简介:</Text>
            <FormItem
              required
              name="introduction"
              control={control}
              errors={errors.introduction}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.introductionInput, { height: Math.max(80, height) }]}
                  value={value}
                  onChangeText={onChange}
                  multiline  //设置多行
                  numberOfLines={2} //行数为2
                  onContentSizeChange={(e) => setHeight(e.nativeEvent.contentSize.height)}
                  placeholder='请输入您的简介'
                  placeholderTextColor="#ccc"
                  textAlignVertical="top"
                />
              )}
              style={{ marginBottom: 20 }}
            />
          </View>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
            <Text style={{ fontSize: 20, textAlign: 'center', backgroundColor: "#2196F3", color: "white", borderRadius: 10, padding: 5 }} >提交修改</Text>
          </TouchableOpacity>
        </View>
      </Card>
    </ScrollView>
  )
}



const styles = StyleSheet.create({
  aboveAll: {
    paddingTop: 20,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 40,
    marginBottom: 40,
  },
  infoItem: {
    flexDirection: 'row',
    borderTopColor: 'grey',
    width: '90%',
    height: 50,
    marginTop: 15,
  },
  lable: {
    fontSize: 23,
    color: 'black',
    flex: 1
  },
  nicknameInput: {
    borderWidth: 1,
    padding: 5,
    borderColor: '#B3BAC1',
    width: 260,
    height: 40,
    fontSize: 20,
  },
  introductionInput: {
    padding: 5,
    width: 260,
    fontSize: 20,
    borderWidth: 1,
    borderColor: '#B3BAC1',
  },
  submitButton: {
    marginTop: 50,
    height: 80,
  }
});