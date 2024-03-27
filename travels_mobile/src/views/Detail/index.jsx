import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import Swiper from 'react-native-swiper'
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// const DetailScreen = ({ navigation, route }) => {
//   // 使用传递过来的cardId
//   const { cardId } = route.params;
const DetailScreen = ({ navigation }) => {
  // useFocusEffect是React Navigation提供的一个Hook。它的作用是当屏幕获得或失去焦点时执行一些操作。
  useFocusEffect(
    // useCallback确保只有当navigation对象变化时，传递给useFocusEffect的函数才会改变。
    React.useCallback(() => {
      // 当进入详情页时隐藏底部导航
      const parent = navigation.getParent(); //父导航器tabBar
      parent.setOptions({ tabBarStyle: { display: 'none' } });

      // 当离开详情页时恢复底部导航
      return () => parent.setOptions({ tabBarStyle: undefined });
    }, [navigation])
  );
  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerLeft: () => (
  //       <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }}>
  //         <TouchableOpacity onPress={() => navigation.goBack()}>
  //           <Image
  //             source={require('返回箭头的图片路径')}
  //             style={{ width: 20, height: 20, marginRight: 10 }}
  //           />
  //         </TouchableOpacity>
  //         {userInfo.avatar && (
  //           <Image
  //             source={{ uri: userInfo.avatar }}
  //             style={{ width: 40, height: 40, borderRadius: 20 }}
  //           />
  //         )}
  //       </View>
  //     ),
  //   });
  // }, [navigation, userInfo]);


  useEffect(() => {
    navigation.setOptions({
      // 设置顶部导航栏左箭头 以及用户头像 昵称
      headerLeft: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="left" size={24} color="black" />
          </TouchableOpacity>
          <Image
            source={{ uri: "https://i0.hdslb.com/bfs/article/39e49451cb2e97b3e80a5c290c65b916a6a9db67.jpg" }}
            style={{ width: 40, height: 40, borderRadius: 20, marginLeft: 15 }}
          />
          <Text style={{ fontSize: 18, marginLeft: 15 }}>用户昵称</Text>
        </View>
      ),
    });
  }, [navigation]); 

  

  const renderPagination = (index, total, context) => {
    // 轮播图分页器
    return (
      <View style={styles.paginationStyle}>
        <Text style={{ color: 'white' }}>
          <Text style={styles.paginationText}>{index + 1}</Text>/{total}
        </Text>
      </View>
    )
  }

  return (
    <View style={{ flexDirection: 'column' }}>
      
      <ScrollView >
        <View style={{ height: 400, backgroundColor: "white", flex: 1 }}>
        {/* 轮播图 */}
        <Swiper style={styles.wrapper}
          autoplay={true}
          renderPagination={renderPagination}
        >
          <View style={styles.slide}>
            <Image source={{ uri: "https://i0.hdslb.com/bfs/article/39e49451cb2e97b3e80a5c290c65b916a6a9db67.jpg" }} style={styles.image} />
          </View>
          <View style={styles.slide}>
            <Image source={{ uri: "https://img0.baidu.com/it/u=4245625267,1147908887&fm=253&fmt=auto&app=120&f=JPEG?w=1422&h=800" }} style={styles.image} />
          </View>
          <View style={styles.slide}>
            <Image source={{ uri: "https://img1.baidu.com/it/u=1294283076,2285234382&fm=253&fmt=auto&app=120&f=JPEG?w=1280&h=800" }} style={styles.image} />
          </View>
          <View style={styles.slide}>
            <Image source={{ uri: "https://img0.baidu.com/it/u=2589580882,2038835390&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=750" }} style={styles.image} />
          </View>
        </Swiper>
      </View>
        <View style={{ backgroundColor: "white", flex: 1 }} >
        <View style={styles.locationContainer}>
          {/* 地址标签 */}
          <View style={styles.locationIcon}>
            <AntDesign name="enviroment" size={18} color="white" />
          </View>
          <Text style={styles.locationText}>上海</Text>
        </View>
        <View>
          <Text style={styles.detailTitle}>这是一个标题~~这是一个标题~~这是一个标题~~这是一个标题~~这是一个标题~~这是一个标题~~</Text>
        </View>
        <View>
          <Text style={styles.detailContent}>这是内容区域~~这是内容区域~~这是内容区域~~这是内容区域~~这是内容区域~~这是内容区域~~这是内容区域~~这是内容区域~~这是内容区域~~这是内容区域~~这是内容区域~~这是内容区域~~这是内容区域~~这是内容区域~~这是内容区域~~这是内容区域~~这是内容区域~~这是内容区域~~这是内容区域~~这是内容区域~~这是内容区域~~这是内容区域~~这是内容区域~~这是内容区域~~这是内容区域~~这是内容区域~~这是内容区域~~这是内容区域~~这是内容区域~~这是内容区域~~这是内容区域~~这是内容区域~~这是内容区域~~这是内容区域~~这是内容区域~~这是内容区域~~</Text>
        </View>
        <Text>1</Text>
        <Text>1</Text>
        <Text>1</Text>
        <Text>1</Text>
        <Text>1</Text>
        <Text>1</Text>
        <Text>1</Text>
        <Text>1</Text>
        <Text>1</Text>
        <Text>1</Text>
        <Text>1</Text>
        <Text>1</Text>
        <Text>1</Text>
        <Text>1</Text>
        <Text>1</Text>
        <Text>1</Text>
        <Text>1</Text>
        <Text>1</Text>
        <Text>1</Text>
        <Text>1</Text>
        <View style={styles.footer}>
          <TextInput style={styles.input} placeholder="写留言…" />
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
      </ScrollView>
      
      {/* <View style={styles.footer}>
        <TextInput style={styles.input} placeholder="写留言…" />
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
      </View> */}
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
    marginLeft: 10,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgb(239,243,246)',
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
    fontSize: 15,
  },
  footer: {
    // flex: 1,
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
  },
  footerIcon: {
    marginHorizontal: 5,
  },
  footerText: {
    fontSize: 14,
  },
})


export default DetailScreen;