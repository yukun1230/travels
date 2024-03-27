import React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Swiper from 'react-native-swiper'



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
    <View>
      
      <View style={{ height: 300,backgroundColor:"#fff" }}>
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
      
      <Text>这是详情页6</Text>

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
  }
})


export default DetailScreen;