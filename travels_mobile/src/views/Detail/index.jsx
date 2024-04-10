import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, Dimensions, Share } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import Swiper from 'react-native-swiper'
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { NGROK_URL } from '../../config/ngrok'
import LoadingOverlay from '../../components/LoadingOverlay';
import { storeToken, getToken, removeToken } from '../../util/tokenRelated'
import { useSelector, useDispatch } from 'react-redux';
import { setUser, clearUser } from '../../redux/userSlice';
import Toast from 'react-native-toast-message';
import { Dialog, Portal } from 'react-native-paper';

const DetailScreen = ({ navigation, route }) => {
  // 使用传递过来的cardId
  const dispatch = useDispatch();
  const [travelDetail, setTravelDetail] = useState(null);
  const { cardId } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const userInfo = useSelector(state => state.user);
  const [liked, setLiked] = useState(userInfo.likeTravels.includes(cardId));
  const [collected, setCollected] = useState(userInfo.collectTravels.includes(cardId));
  const [isRequesting, setIsRequesting] = useState(false);
  const [visible, setVisible] = useState(false);

  const showDialog = () => setVisible(true);
  const hideDialog = () => {
    setIsRequesting(false);
    setVisible(false)
  };

  useEffect(() => {
    setIsLoading(true);
    // console.log(userInfo,cardId);
    axios.get(`${NGROK_URL}/travels/getDetails`, {
      params: { id: cardId },
    })
      .then(res => {
        setTravelDetail(res.data.travelDetail);
        // console.log(res.data.travelDetail);
        // 更新导航栏信息
        navigation.setOptions({
          headerLeft: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 10, marginTop: -16 }}>
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
          // headerStyle: {
          //   backgroundColor:'blue', // 设置顶部间距
          //   height:10,
          // },
        });
        setIsLoading(false);
        // console.log(res.data.travelDetail);
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


  const handleShare = () => {
    // console.log('分享');
    const uri = userInfo.nickname + '给你分享了一篇游记,快来看看吧~    ' + 'http://5fvskc9y2ble.xiaomiqiu.com/public/share/index.html?id=' + cardId;
    // console.log(uri);
    //   Share.share({
    //   message: 'React Native | A framework for building native apps using React',
    //   url: 'http://facebook.github.io/react-native/',
    //   title: 'React Native'
    // }, {
    //   // Android only:
    //   dialogTitle: 'Share React Native website',
    //   // iOS only:
    //   excludedActivityTypes: [
    //     'com.apple.UIKit.activity.PostToTwitter'
    //   ]
    // });
    Share.share({
      message: uri,
    }, {
      // Android only:
      dialogTitle: 'Share React Native website',
      // iOS only:
    })
  }

  const handleCollect = async (cardId) => {
    // 处理收藏逻辑
    try {
      if (!userInfo.id) {
        console.log('用户未登录');
        Toast.show({
          type: 'error',
          text1: '您还没有登录哦~',
          position: 'top',
          autoHide: true,
          visibilityTime: 1000,
        })
        return;
      }
      if (isRequesting) {
        return;
      }
      setIsRequesting(true);
      const token = await getToken();
      if (!token) {
        console.log('无有效Token，需要登录');
        return;
      }
      // console.log(userInfo.id, cardId, token,collected);

      if (!collected) {
        const response = await axios.post(`${NGROK_URL}/travels/collectTravel`, { travelId: cardId }, { headers: { 'token': token } });
        // console.log(response.data.message);
        setIsRequesting(false);
        if (response.data.message === '收藏成功') {
          setCollected(true); // 更新状态
          setTravelDetail((prevDetail) => ({
            ...prevDetail,
            collectedCount: prevDetail.collectedCount + 1,
          }));
          dispatch(setUser({
            ...userInfo,
            collectTravels: [...userInfo.collectTravels, cardId],
          }));

        } else {
          console.log('收藏失败', response.data.message);
        }
      } else {
        // const response = await axios.post(`${NGROK_URL}/travels/UndoCollectTravel`, { travelId:cardId }, { headers: { 'token': token } });
        // console.log(response.data.message);
        // setIsRequesting(false);
        // if (response.data.message==='取消收藏成功') {
        //   setCollected(false); // 更新状态
        //   setTravelDetail((prevDetail) => ({
        //     ...prevDetail,
        //     collectedCount: prevDetail.collectedCount - 1,
        //   }));
        //   dispatch(setUser({
        //       ...userInfo,
        //       collectTravels: userInfo.collectTravels.filter(item => item !== cardId),
        //   }));

        // } else {
        //     console.log('收藏失败', response.data.message);
        // }
        showDialog()
      }
    } catch (error) {
      console.error('点赞请求失败:', error);
    }
  };


  const cancelCollected = async (cardId) => {
    setIsRequesting(true);
    const token = await getToken();
    try {
      const response = await axios.post(`${NGROK_URL}/travels/UndoCollectTravel`, { travelId: cardId }, { headers: { 'token': token } });
      // console.log(response.data.message);
      setIsRequesting(false);
      if (response.data.message === '取消收藏成功') {
        setCollected(false); // 更新状态
        setTravelDetail((prevDetail) => ({
          ...prevDetail,
          collectedCount: prevDetail.collectedCount - 1,
        }));
        dispatch(setUser({
          ...userInfo,
          collectTravels: userInfo.collectTravels.filter(item => item !== cardId),
        }));

      } else {
        console.log('收藏失败', response.data.message);
      };
      hideDialog()
    } catch (error) {
      console.error('点赞请求失败:', error);
    }
  }


  const handleLike = async (cardId) => {
    // 处理点赞逻辑

    try {
      if (!userInfo.id) {
        console.log('用户未登录');
        Toast.show({
          type: 'error',
          text1: '您还没有登录哦~',
          position: 'top',
          autoHide: true,
          visibilityTime: 1000,
        })
        return;
      }
      if (isRequesting) {
        return;
      }
      setIsRequesting(true);
      const token = await getToken();
      if (!token) {
        console.log('无有效Token，需要登录');
        return;
      }
      // console.log(userInfo.id, cardId, token,liked);

      if (!liked) {
        const response = await axios.post(`${NGROK_URL}/travels/likeTravel`, { travelId: cardId }, { headers: { 'token': token } });
        // console.log(response.data.message);
        setIsRequesting(false);
        if (response.data.message === '点赞成功') {
          setLiked(true); // 更新状态
          setTravelDetail((prevDetail) => ({
            ...prevDetail,
            likedCount: prevDetail.likedCount + 1,
          }));
          // console.log(userInfo);
          // console.log([...userInfo.likeTravels,cardId]);
          dispatch(setUser({
            ...userInfo,
            likeTravels: [...userInfo.likeTravels, cardId],
          }));
        } else {
          console.log('点赞失败', response.data.message);
        }
      } else {
        const response = await axios.post(`${NGROK_URL}/travels/UndoLikeTravel`, { travelId: cardId }, { headers: { 'token': token } });
        // console.log(response.data.message);
        setIsRequesting(false);
        if (response.data.message === '取消点赞成功') {
          setLiked(false); // 更新状态
          setTravelDetail((prevDetail) => ({
            ...prevDetail,
            likedCount: prevDetail.likedCount - 1,

          }));
          // console.log(userInfo.likeTravels.filter(item => item !== cardId));
          dispatch(setUser({
            ...userInfo,
            likeTravels: userInfo.likeTravels.filter(item => item !== cardId),
          }));
        } else {
          console.log('取消点赞失败', response.data.message);
        }
      }
    } catch (error) {
      console.error('点赞请求失败:', error);
    }
  };



  return (
    <View style={{ flexDirection: 'column' }}>
      <LoadingOverlay isVisible={isLoading} />
      <Portal >
        {/* 删除对话框 */}
        <Dialog visible={visible} onDismiss={hideDialog} style={styles.dialogStyle}>
          <Dialog.Title style={styles.dialogTitleStyle}>取消收藏</Dialog.Title>
          <Dialog.Content style={styles.dialogContentStyle}>
            <Text style={{ fontSize: 16 }}>您确定不再收藏这篇游记吗？</Text>
          </Dialog.Content>
          <Dialog.Actions style={{ marginTop: -10, borderTopColor: 'grey', borderTopWidth: 0.5, flexDirection: 'row', paddingBottom: 0, paddingHorizontal: 0, height: 50 }}>
            <View style={{ flex: 1, borderRightWidth: 0.5, borderRightColor: 'grey', height: 50, justifyContent: 'center', alignItems: 'center', }}>
              <TouchableOpacity style={{ width: 150, height: 50, justifyContent: 'center', alignItems: 'center' }} onPress={hideDialog}>
                <Text style={{ color: 'grey', fontSize: 18 }}>取消</Text>
              </TouchableOpacity>
            </View>
            {/* <View></View> */}

            <TouchableOpacity style={{
              flex: 1, height: 50, justifyContent: 'center',
              alignItems: 'center',
            }} onPress={() => cancelCollected(cardId)}>
              <Text style={{ color: '#d32f2f', fontSize: 18 }}>确定</Text>
            </TouchableOpacity>
          </Dialog.Actions>
        </Dialog>
      </Portal>


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

              {travelDetail.location && <View style={{ flexDirection: 'row' }}>
                {/* 地址标签 */}
                {travelDetail.location.country && travelDetail.location.country !== 'undefined' && travelDetail.location.country !== '中国' && <View style={styles.locationContainer}>
                  <View style={styles.locationIcon}>
                    <AntDesign name="enviroment" size={12} color="white" />
                  </View>
                  <Text style={styles.locationText}>{travelDetail.location.country}</Text>
                </View>}
                {travelDetail.location.province && travelDetail.location.province !== 'undefined' && <View style={styles.locationContainer}>
                  <View style={styles.locationIcon}>
                    <AntDesign name="enviroment" size={12} color="white" />
                  </View>
                  <Text style={styles.locationText}>{travelDetail.location.province}</Text>
                </View>}
                {travelDetail.location.city && travelDetail.location.city !== 'undefined' && <View style={styles.locationContainer}>
                  <View style={styles.locationIcon}>
                    <AntDesign name="enviroment" size={12} color="white" />
                  </View>
                  <Text style={styles.locationText}>{travelDetail.location.city}</Text>
                </View>}

              </View>}

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
          <Text style={styles.loading}>加载中...</Text>
        )}
      </ScrollView>
      <View style={styles.footer}>
        {/* 底部栏 */}
        {/* <TextInput style={styles.input} placeholder="评论一下吧~" /> */}
        <TouchableOpacity style={styles.footerIcon}>
          <AntDesign name="like2" size={24} color={liked ? "red" : "black"} onPress={() => handleLike(cardId)} />
          {travelDetail ? <Text style={[styles.footerText, { color: liked ? "red" : "black" }]}>{travelDetail.likedCount}</Text> : <Text style={[styles.footerText, { color: liked ? "red" : "black" }]}></Text>}
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.footerIcon}>
            <FontAwesome6 name="commenting" size={24} color="black" />
            <Text style={styles.footerText}>76</Text>
          </TouchableOpacity> */}
        <TouchableOpacity style={styles.footerIcon} onPress={handleShare}>
          <SimpleLineIcons name="share-alt" size={24} color="black" />
          <Text style={styles.footerText}>分享</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerIcon} onPress={() => handleCollect(cardId)}>
          <MaterialCommunityIcons name="heart-plus-outline" size={24} color={collected ? "red" : "black"} />
          {travelDetail ? <Text style={[styles.footerText, { color: collected ? "red" : "black" }]}>{travelDetail.collectedCount}</Text> : <Text style={[styles.footerText, { color: liked ? "red" : "black" }]}></Text>}
        </TouchableOpacity>
      </View>

    </View>


  );
};


const screenHeight = Dimensions.get('window').height;


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
  paginationStyle: {
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
    // marginTop: 0,
    marginLeft: 2,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgb(243,243,243)',
    marginRight: 8,
  },
  locationIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'black',
    justifyContent: 'center', // 图标垂直居中
    alignItems: 'center', // 图标水平居中
    marginRight: 6, // 图标和文本之间的距离
  },
  locationText: {
    color: 'black', // 文字颜色
    marginRight: 10, // 文字和右箭头之间的距离
    fontSize: 12, // 文字大小
    fontWeight: 'bold'
  },
  detailTitle: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: 'bold',
  },
  detailContent: {
    marginTop: 12,
    minHeight: screenHeight - 500,
    lineHeight: 28,
    fontSize: 15,
  },
  loading: {
    marginTop: 50,
    alignSelf: 'center',
    fontSize: 20,
    height: screenHeight + 100
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
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
  dialogStyle: {
    backgroundColor: 'white', // 修改对话框的背景色
    borderRadius: 10, // 设置边角圆滑度
    padding: 0, // 内部间距
  },
  dialogTitleStyle: {
    color: 'black', // 标题文字颜色
    // textAlign: 'center', // 标题居中
  },
  dialogContentStyle: {
    color: 'grey', // 内容文字颜色
    marginBottom: 10, // 内容与对话框底部的间距
  },
})


export default DetailScreen;