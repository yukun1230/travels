import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import Swiper from 'react-native-swiper'
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { NGROK_URL } from '../../config/ngrok'
import LoadingOverlay from '../../components/LoadingOverlay'; 


const DetailScreen = ({ navigation, route }) => {
  // 使用传递过来的cardId

  const [travelDetail, setTravelDetail] = useState(null);
  const { cardId } = route.params;
  const [isLoading, setIsLoading] = useState(false);




  useEffect(() => {
    setIsLoading(true);
    axios.get(`${NGROK_URL}/travels/getDetails`, {
      params: { id: cardId },
    })
      .then(res => {
        setTravelDetail(res.data.travelDetail);
        // 更新导航栏信息
        navigation.setOptions({
          headerLeft: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <AntDesign name="left" size={24} color="black" />
              </TouchableOpacity>
              <Image
                source={{ uri: res.data.travelDetail.userInfo.avatar }}
                style={{ width: 40, height: 40, borderRadius: 20, marginLeft: 15 }}
              />
              <Text style={{ fontSize: 18, marginLeft: 15 }}>{res.data.travelDetail.userInfo.nickname}</Text>
            </View>
          ),
        });
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
      });
  }, [cardId, navigation]); 

  

  const renderPagination = (index, total, context) => {
    // 轮播图分页器
    return (
      <View style={styles.paginationStyle}>
        <Text style={{ color: 'white' }}>
          <Text>{index + 1}</Text>/{total}
        </Text>
      </View>
    )
  }

  return (
    <View style={{ flexDirection: 'column' }}>
      <LoadingOverlay isVisible={isLoading} />
      
      
      <ScrollView>
        {travelDetail ? (
          <>
            <View style={{ height: 400, backgroundColor: "rgb(243,243,243)", flex: 1 }}>
             <Swiper
              style={styles.wrapper}
              autoplay={true}
              renderPagination={renderPagination}
            >
              {travelDetail.photo.map((photo, index) => (
                <View key={index} style={styles.slide}>
                  <Image source={{ uri: photo.uri }} style={styles.image} />
                </View>
              ))}
             </Swiper>
            </View>
            
            <View style={{ backgroundColor: "white", flex: 1, padding: 10 }} >
              <View style={styles.locationContainer}>
                {/* 地址标签 */}
                <View style={styles.locationIcon}>
                  <AntDesign name="enviroment" size={18} color="white" />
                </View>
                <Text style={styles.locationText}>上海</Text>
              </View>
              <View>
                {/* 标题 */}
                <Text style={styles.detailTitle}>{travelDetail.title}</Text>
              </View>
              <View>
                {/* 内容 */}
                <Text style={styles.detailContent}>{travelDetail.content}</Text>
              </View>
              {/* 留白区域，避免最底部的内容被底部栏挡住 */}
              <View style={{ height: 52 }}></View>
            </View>
          </>
        ) : (
          <Text>Loading...</Text>
        )}
      </ScrollView>

      <View style={styles.footer}>
          {/* 底部栏 */}
          <TextInput style={styles.input} placeholder="评论一下吧~" />
          <TouchableOpacity style={styles.footerIcon}>
            <AntDesign name="like2" size={24} color="black" />
            <Text style={styles.footerText}>1228</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerIcon}>
            <FontAwesome6 name="commenting" size={24} color="black" />
            <Text style={styles.footerText}>76</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerIcon}>
            <SimpleLineIcons name="share-alt" size={24} color="black" />
            <Text style={styles.footerText}>分享</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerIcon}>
            <MaterialCommunityIcons name="heart-plus-outline" size={24} color="black" />
            <Text style={styles.footerText}>261</Text>
          </TouchableOpacity>
        </View>
      
    </View>
    
    
  );
};


const styles = StyleSheet.create({
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold'
  },
  image: {
    width: '100%', // 根据需要调整
    height: '100%', // 根据需要调整
    resizeMode: 'contain', // 或其他resize模式
  },
  paginationStyle:{
    position: 'absolute',
    top: 10,
    right: 10,
    width: 52,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 黑色背景，50%透明度
    borderRadius: 15, // 圆角大小
  },
  locationContainer: {
    flexDirection: 'row', // 子元素水平排列
    alignItems: 'center', // 子元素垂直居中
    alignSelf: 'flex-start',
    marginTop: 15,
    marginLeft: 2,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgb(243,243,243)',
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
    color: 'black', // 文字颜色
    marginRight: 15, // 文字和右箭头之间的距离
    fontSize: 12, // 文字大小
    fontWeight: 'bold'
  },
  detailTitle:{
    marginTop: 15,
    fontSize: 20,
    fontWeight: 'bold',
  },
  detailContent:{
    marginTop: 12,
    minHeight: 98,
    fontSize: 15,
  },
  footer: {
    position: 'absolute', 
    left: 0, 
    right: 0, 
    bottom: 0, 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#e1e1e1',
    height: 52,
    
  },
  input: {
    borderWidth: 1,
    borderColor: '#e1e1e1',
    padding: 8,
    borderRadius: 15,
    flex: 1,
    marginRight: 10,
    backgroundColor: 'rgb(243,243,243)',
  },
  footerIcon: {
    marginHorizontal: 10,
    alignItems: 'center',
    
  },
  footerText: {
    fontSize: 12,
  },
})


export default DetailScreen;