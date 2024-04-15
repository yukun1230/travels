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
  

  return (
    <View style={{flex:1, backgroundColor:'white'}}>
      <View style={{marginTop:'10%', alignSelf:'center'}}>
        {/* 修改用户头像 */}
        <TouchableOpacity
          onPress={pickImage}>
          <Image
            source={{ uri: "https://5b0988e595225.cdn.sohucs.com/images/20171114/bc48840fb6904dd4bd8f6a8af8178af4.png" }}
            style={{ width: 60, height: 60, borderRadius: 30 }}
          />
        </TouchableOpacity>

      </View>

      <View style={{marginTop:'8%'}}>
        {/* 信息项 */}
        <View style={styles.infoItem}>
          <Text style={{fontSize:20}}>昵称:</Text>
          <TextInput style={{fontSize:20,marginLeft:'5%'}}>123</TextInput>
        </View>
        <View style={styles.infoItem}>
          <Text style={{fontSize:20}}>其他:</Text>
          <TextInput style={{fontSize:20,marginLeft:'5%'}}>123</TextInput>
        </View>
      </View>
        
      <View style={{marginTop:'8%'}}>
        {/* 自我介绍 */}
        <Text>
          123
        </Text>
      </View>
      
    </View>
    
    

  )
}



const styles = StyleSheet.create({
  infoItem:{
    flexDirection:'row',
    alignItems: 'center',
    borderTopColor:'grey',
    borderTopWidth:1,
    width:'80%',
    alignSelf:'center',
    padding:15
  }
 
  
});