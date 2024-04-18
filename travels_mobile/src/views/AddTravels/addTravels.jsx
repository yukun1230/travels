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
import React, { useEffect, useState } from 'react';
import Button from 'apsl-react-native-button';
import FormItem from './components/formItem';
import UnLoginScreen from '../../components/unLogin';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { NGROK_URL } from '../../config/ngrok';
import '../../util/axios.config';
import { useSelector, useDispatch } from 'react-redux';
import LoadingOverlay from '../../components/LoadingOverlay';
import { Picker } from '@react-native-picker/picker';
import placeList from './placeList';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import MyDialog from '../../components/myDialog';
import Toast from 'react-native-toast-message';
export default addTravelsScreen = () => {
  const [image, setImage] = useState([]); // 数组来保存图片uri
  const [file, setFile] = useState([]); // 数组用于传到后端
  const [dimension, setDimension] = useState([]); // 数组用于存储图片的长度和宽度
  const [isLoading, setIsLoading] = useState(false);  // 用于设置加载moadl是否展示
  const [height, setHeight] = useState(0);  // 关于输入文本框高度的选项
  const [fold, setFold] = useState(true)  // 地点选择卡片是否折叠，默认折叠
  const [selectedValues, setSelectedValues] = useState([]);  // 选择的数组
  const [filteredProvinces, setFilteredProvinces] = useState([]);  // 省份
  const [filteredCities, setFilteredCities] = useState([]);  // 城市
  const [visible, setVisible] = useState(false);  //取消对话框显隐
  const [isSubmitPhoto, setIsSubmitPhoto] = useState(false);
  const navigation = useNavigation();
  const userInfo = useSelector(state => state.user); // 获取保存的用户信息
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      title: '',
      content: ''
    },
  });

  // 控制对话框显隐
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);


  const handleCountryChange = (countryName, index) => {
    setSelectedValues((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = countryName;
      newValues[index + 1] = '';
      newValues[index + 2] = '';
      return newValues;
    });
    const selectedCountry = placeList.find(country => country.name === countryName);
    if (selectedCountry) {
      setFilteredProvinces(selectedCountry.provinces);
      setFilteredCities([]);
    } else {
      setFilteredProvinces([]);
      setFilteredCities([])
    }
  };

  const handleProvinceChange = (provinceName, index) => {
    setSelectedValues((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = provinceName;
      newValues[index + 1] = '';
      return newValues;
    });

    const selectedCountry = placeList.find(country => country.name === selectedValues[0]);
    if (selectedCountry) {
      const selectedProvince = selectedCountry.provinces.find(province => province.name === provinceName);
      if (selectedProvince) {
        setFilteredCities(selectedProvince.cities);
      } else (
        setFilteredCities([])
      )
    }
  };

  const pickImage = async () => {  // 选取图片，异步操作
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

  useEffect(() => {
    reset(); // 重置
    setHeight(0);
  }, [isSubmitSuccessful]&&[isSubmitPhoto])

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

  // 提交表单
  const onSubmit = async (data) => {
    if (file.length > 0) {  // 如果文件存在
      setIsLoading(true); // 开始加载图标
      let params = new FormData();
      for (let item of file) params.append('file', item);// 添加游记的图片
      for (let i in data) params.append(i, data[i]); // 添加游记的标题和内容
      for (let i = 0; i < dimension.length; i++)  // 添加图片信息
        params.append(dimension[i].name, `${dimension[i].width}/${dimension[i].height}`);
      for (let i in userInfo) params.append(i, userInfo[i]); // 添加用户信息
      params.append("country", selectedValues[0]); // 添加位置信息(国家)
      params.append("province", selectedValues[1]); // 添加位置信息(省份)
      params.append("city", selectedValues[2]); // 添加位置信息(城市)
      params.append("travelState", 2);// 添加游记的审核状态 0审核未通过，1审核通过，2未审核，3被删除，4为草稿
      params.append("collectedCount", 0);
      params.append("likedCount", 0);
      await axios.post(NGROK_URL + '/travels/upload', params, {
        headers: {
          'Content-Type': 'multipart/form-data' // 告诉后端，有文件上传
        }
      }).then(
        res => {
          console.log(res.data);
          Alert.alert(res.data.message);
          setIsLoading(false);
        }
      ).catch(
        err => {
          console.log(err);
          setIsLoading(false);
        }
      )
      setFile([]);  //文件清空
      setSelectedValues([]); // 地点清空
      setImage([]); // 回显清空
      setDimension([]); // 图片尺寸清空
      setIsSubmitPhoto(!isSubmitPhoto);
      navigation.navigate("我的")
    } else {
      Alert.alert("您还没有上传图片，请上传图片后再发布");
    }
  };

  const onDraftSubmit = async (data) => {
    if (file.length > 0) {
      setIsLoading(true); // 开始加载图标
      let params = new FormData();
      for (let item of file) params.append('file', item);// 添加游记的图片
      for (let i in data) params.append(i, data[i]); // 添加游记的标题和内容
      for (let i = 0; i < dimension.length; i++)  // 添加图片信息
        params.append(dimension[i].name, `${dimension[i].width}/${dimension[i].height}`);
      for (let i in userInfo) params.append(i, userInfo[i]); // 添加用户信息
      params.append("country", selectedValues[0]); // 添加位置信息(国家)
      params.append("province", selectedValues[1]); // 添加位置信息(省份)
      params.append("city", selectedValues[2]); // 添加位置信息(城市)
      params.append("travelState", 4);// 添加游记的审核状态 0审核未通过，1审核通过，2未审核，3被删除，4为草稿
      params.append("collectedCount", 0);
      params.append("likedCount", 0);
      await axios.post(NGROK_URL + '/travels/upload', params, {
        headers: {
          'Content-Type': 'multipart/form-data' // 告诉后端，有文件上传
        }
      }).then(
        res => {
          console.log(res.data);
          Alert.alert("草稿保存成功");
          setIsLoading(false);
        }
      ).catch(
        err => {
          console.log(err);
          setIsLoading(false);
        }
      )
      setFile([]);  //文件清空
      setSelectedValues([]); // 地点清空
      setImage([]); // 回显清空
      setDimension([]); // 图片尺寸清空
      setIsSubmitPhoto(!isSubmitPhoto); 
      navigation.navigate("我的")
    }
    else {
      Alert.alert("您还没有上传图片，请上传图片后再保存草稿");
    }
  }

  return (
    <>
      {!userInfo.id && <UnLoginScreen />}
      <MyDialog
        visible={visible}
        onDismiss={hideDialog}
        titleText="存草稿"
        dialogText="您确定要将这篇游记存草稿？"
        cancelText="取消"
        confirmText="确认"
        handleCancel={hideDialog}
        handleConfirm={() => {
          if (!watch("title") || !watch("content")) {
            Toast.show({
              type: 'error',
              text1: "标题和内容不能为空",
              position: 'top',
              autoHide: true,
              visibilityTime: 1500,
            })
            hideDialog();
          } else {
            handleSubmit(onDraftSubmit)();
            hideDialog();
          }
        }
        }
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {userInfo.id && <View style={styles.aboveAll}>
          <LoadingOverlay isVisible={isLoading} />
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={image.length < 3 ? false : true} //是否允许滚动，当图片数量少于3个的时候，设置滚动不可用，为什么要这么设置呢？因为这里有bug，当没有图片时，也可以滚动，这就导致了‘添加图片’的图标左右横跳非常不美观
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
            isSubmitSuccessful={isSubmitSuccessful.title}
            rules={{
              required: '不能为空',
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholderTextColor="#ccc"
                style={styles.titleInput}
                placeholder='填写标题'
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
              }}
              errors={errors.content}
              isSubmitSuccessful={isSubmitSuccessful.content}
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
            <TouchableOpacity onPress={() => setFold(!fold)} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginTop: 20 }}>
              <View style={styles.locationIcon}>
                <AntDesign name="enviroment" size={18} color="white" />
              </View>
              {!selectedValues[0] && <Text style={styles.locationText}>添加地点</Text>}
              {selectedValues[0] && <Text style={{ fontSize: 18, marginRight: 15, marginLeft: 8 }}>地点：{selectedValues.filter(item => item != '').join('•')}</Text>}
              {fold && <Text style={{ fontSize: 16 }}>{'>'}</Text>}
              {!fold && <Text style={{ fontSize: 16, transform: [{ rotate: '90deg' }] }}>{'>'}</Text>}
            </TouchableOpacity>
            {!fold && <Card style={{ flexDirection: 'column', alignItems: 'center', marginTop: 20, marginLeft: 20, marginRight: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 18 }}>选择国家</Text>
                <Picker
                  style={styles.picker}
                  selectedValue={selectedValues[0]}
                  onValueChange={(value) => handleCountryChange(value, 0)}>
                  <Picker.Item label='未选' value='' />
                  {placeList.map((country, index) => (
                    <Picker.Item label={country.name} value={country.name} key={index} />
                  ))}
                </Picker>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 18 }}>选择省份</Text>
                <Picker
                  style={styles.picker}
                  selectedValue={selectedValues[1]}
                  onValueChange={(value) => handleProvinceChange(value, 1)}>
                  <Picker.Item label='未选' value='' />
                  {filteredProvinces.map((province, index) => (
                    <Picker.Item label={province.name} value={province.name} key={index} />
                  ))}
                </Picker>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 18 }}>选择城市</Text>
                <Picker
                  style={styles.picker}
                  selectedValue={selectedValues[2]}
                  onValueChange={(value) => setSelectedValues((prevValues) => {
                    const newValues = [...prevValues];
                    newValues[2] = value;
                    return newValues;
                  })}>
                  <Picker.Item label='未选' value='' />
                  {filteredCities.map((city, index) => (
                    <Picker.Item label={city} value={city} key={index} />
                  ))}
                </Picker>
              </View>
            </Card>}
            <View style={{ flexDirection: "row", marginTop: 80 }}>
              <TouchableOpacity style={{ alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}
                disable={isLoading ? "true" : "false"}
                onPress={showDialog}
              >
                <Ionicons name="file-tray-full-outline" size={26} />
                <Text style={{ fontSize: 11 }}>存草稿</Text>
              </TouchableOpacity>
              <Button style={styles.submit_Button} textStyle={{ fontSize: 18, color: "white" }} onPress={
                handleSubmit(onSubmit)} disable={isLoading ? "true" : "false"}>发布</Button>
            </View>
          </View>
        </View>}
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  aboveAll: {
    paddingLeft: 15,
    paddingRight: 15,
    marginTop: 20
  },
  submit_Button: {
    flex: 1,
    backgroundColor: '#2196F3',
    marginLeft: 10,
    marginRight: 10,
    height: 40,
    borderRadius: 20,
    borderColor: "#2196F3"
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
  photo_Container: {
    width: 98,
    height: 98,
    borderRadius: 9,
    borderWidth: 1,
    position: "relative",
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
  },
  locationIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'black',
    justifyContent: 'center', // 图标垂直居中
    alignItems: 'center', // 图标水平居中
    marginRight: 6, // 图标和文本之间的距离
  },
  locationText: {
    marginLeft: 8,
    color: 'black', // 文字颜色
    marginRight: 15, // 文字和右箭头之间的距离
    fontSize: 18, // 文字大小
    fontWeight: 'bold'
  },
  picker: {
    height: 40,
    width: 180
  },
});