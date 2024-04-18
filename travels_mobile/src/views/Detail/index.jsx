import React, { useEffect, useState, useRef } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, Share } from 'react-native';
import PagerView from 'react-native-pager-view';
import { AntDesign } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { NGROK_URL } from '../../config/ngrok';
import LoadingOverlay from '../../components/LoadingOverlay';
import { getToken } from '../../util/tokenRelated';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../redux/userSlice';
import Toast from 'react-native-toast-message';
import moment from 'moment';
import { Modal } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import MyDialog from '../../components/myDialog';

const DetailScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();  //redux状态修改
  const [travelDetail, setTravelDetail] = useState(null);  //游记详情数据
  const { cardId } = route.params;  //获取卡片id参数
  const [isLoading, setIsLoading] = useState(false);  //加载态组件状态
  const userInfo = useSelector(state => state.user);  //redux获取用户信息
  const [liked, setLiked] = useState(userInfo.likeTravels.includes(cardId));  //点赞状态
  const [collected, setCollected] = useState(userInfo.collectTravels.includes(cardId));  //收藏状态
  const [photoDetail, setPhoteDtail] = useState([]);
  const [isRequesting, setIsRequesting] = useState(false);  //请求状态控制,防止多次点赞收藏请求
  const [visible, setVisible] = useState(false);  //取消收藏对话框显隐
  const [showImage, setShowImage] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 控制对话框显隐
  const showDialog = () => setVisible(true);
  const hideDialog = () => {
    setIsRequesting(false);
    setVisible(false)
  };

  useEffect(() => {
    // 进入页面发请求
    setIsLoading(true);
    // 根据卡片id请求后端游记详情数据
    axios.get(`${NGROK_URL}/travels/getDetails`, {
      params: { id: cardId },
    })
      .then(res => {
        // 数据存入状态
        if (!res.data.travelDetail.likedCount) {
          res.data.travelDetail.likedCount = 0;
        }
        if (!res.data.travelDetail.collectedCount) {
          res.data.travelDetail.collectedCount = 0;
        }
        const formattedDateString = moment(res.data.travelDetail.createTime).format('发布于YYYY-MM-DD');
        res.data.travelDetail.formattedDateString = formattedDateString;
        let myPhotoDetail = res.data.travelDetail.photo; // 数组
        myPhotoDetail.forEach(obj => {
          if (obj.uri) {
            obj.url = obj.uri;
            delete obj.uri;
          }
        })
        setPhoteDtail(myPhotoDetail)
        setTravelDetail(res.data.travelDetail);
        navigation.setOptions({
          headerLeft: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 10, marginLeft: -15 }}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <AntDesign name="left" size={24} color="black" />
              </TouchableOpacity>
              <Image
                source={{ uri: res.data.travelDetail.userInfo.avatar }}
                style={{ width: 38, height: 38, borderRadius: 19, marginLeft: 15 }}
              />
              <Text style={{ fontSize: 18, marginLeft: 12 }}>{res.data.travelDetail.userInfo.nickname}</Text>
            </View>
          ),
        });
        // 加载态结束
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, [cardId, navigation]);

  const handleShare = () => {
    // 分享功能
    const uri = `【${userInfo.nickname}】给您分享了一篇游记,快来看看吧~\n http://5fvskc9y2ble.xiaomiqiu.com/public/share/index.html?id=${cardId}`;
    Share.share({
      message: uri,
    }, {
      // Android only:
      dialogTitle: '游记分享~',
    })
  }

  const handleCollect = async (cardId) => {
    // 处理收藏逻辑
    try {
      if (!userInfo.id) {
        // 未登录提醒
        Toast.show({
          type: 'error',
          text1: '您还没有登录哦~',
          position: 'top',
          autoHide: true,
          visibilityTime: 1000,
        })
        return;
      }
      // 请求中则直接返回,防止多次点击请求
      if (isRequesting) {
        return;
      }
      // 开始请求
      setIsRequesting(true);
      const token = await getToken();
      if (!token) {
        console.log('无Token，需要登录');
        return;
      }
      if (!collected) {
        // 如果是未收藏状态
        const response = await axios.post(`${NGROK_URL}/travels/collectTravel`, { travelId: cardId }, { headers: { 'token': token } });
        setIsRequesting(false);
        if (response.data.message === '收藏成功') {
          setCollected(true); // 更新状态
          setTravelDetail((prevDetail) => ({
            ...prevDetail,
            collectedCount: prevDetail.collectedCount + 1,
          }));
          // 更新用户redux收藏游记信息
          dispatch(setUser({
            ...userInfo,
            collectTravels: [...userInfo.collectTravels, cardId],
          }));
        } else {
          console.log('收藏失败', response.data.message);
        }
      } else {
        // 打开取消收藏对话框
        showDialog()
      }
    } catch (error) {
      console.error('点赞请求失败:', error);
    }
  };


  const cancelCollected = async (cardId) => {
    // 取消收藏逻辑
    setIsRequesting(true);
    const token = await getToken();
    try {
      const response = await axios.post(`${NGROK_URL}/travels/UndoCollectTravel`, { travelId: cardId }, { headers: { 'token': token } });
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
        console.log('取消收藏失败', response.data.message);
      };
      // 关闭对话框
      hideDialog()
    } catch (error) {
      console.error('收藏请求失败:', error);
    }
  }

  const handleLike = async (cardId) => {
    // 处理点赞逻辑
    try {
      if (!userInfo.id) {
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
        console.log('无Token，需要登录');
        return;
      }
      if (!liked) {
        const response = await axios.post(`${NGROK_URL}/travels/likeTravel`, { travelId: cardId }, { headers: { 'token': token } });
        setIsRequesting(false);
        if (response.data.message === '点赞成功') {
          setLiked(true); // 更新状态
          setTravelDetail((prevDetail) => ({
            ...prevDetail,
            likedCount: prevDetail.likedCount + 1,
          }));
          dispatch(setUser({
            ...userInfo,
            likeTravels: [...userInfo.likeTravels, cardId],
          }));
        } else {
          console.log('点赞失败', response.data.message);
        }
      } else {
        const response = await axios.post(`${NGROK_URL}/travels/UndoLikeTravel`, { travelId: cardId }, { headers: { 'token': token } });
        setIsRequesting(false);
        if (response.data.message === '取消点赞成功') {
          setLiked(false); // 更新状态
          setTravelDetail((prevDetail) => ({
            ...prevDetail,
            likedCount: prevDetail.likedCount - 1,
          }));
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
      {/* 加载态组件 */}
      <LoadingOverlay isVisible={isLoading} />
      <MyDialog
        visible={visible}
        onDismiss={hideDialog}
        titleText="取消收藏"
        dialogText="您确定不再收藏这篇游记吗？"
        cancelText="取消"
        confirmText="确认"
        handleCancel={hideDialog}
        handleConfirm={() => cancelCollected(cardId)}
      />
      <ScrollView>
        {/* 滚动视图 */}
        {travelDetail ? (
          <>
            <View style={{ height: 500, backgroundColor: "rgb(243,243,243)" }}>
              <PagerView
                style={styles.wrapper}
                initialPage={0}
                scrollEnabled={true}
                onPageSelected={event => setCurrentIndex(event.nativeEvent.position)}
              >
                {travelDetail.photo.map((photo, index) => (
                  <View style={styles.slide} key={index}>
                    <TouchableOpacity
                      onPress={() => {
                        // console.log(index)
                        setShowImage(true)
                      }}
                      style={styles.image_contain}
                      activeOpacity={1}
                      disabled={showImage}
                    >
                      <Image source={{ uri: photo.url }} style={styles.image} />
                    </TouchableOpacity>
                  </View>
                ))}
              </PagerView>
              <View style={styles.paginationStyle}>
                <Text style={{ color: 'white' }}>
                  <Text>{currentIndex + 1}</Text>/{travelDetail.photo.length}
                </Text>
              </View>
              <Modal
                visible={showImage}
                transparent={true}
              >
                <ImageViewer
                  index={currentIndex}
                  imageUrls={travelDetail.photo.map(photo => ({ url: photo.url }))}
                  onClick={() => setShowImage(false)}
                  saveToLocalByLongPress={false}
                />
              </Modal>
            </View>

            {/* 内容视图 */}
            <View style={{ backgroundColor: "white", flex: 1, padding: 10 }} >
              {travelDetail.location &&
                <View style={{ flexDirection: 'row' }}>
                  {/* 地址标签栏 */}
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
                </View>
              }
              <View>
                {/* 标题 */}
                <Text style={styles.detailTitle}>{travelDetail.title}</Text>
              </View>
              <View>
                {/* 内容 */}
                <Text style={styles.detailContent}>{travelDetail.content}</Text>
              </View>
              <View>
                {/* 时间 */}
                <Text style={styles.detailTime}>{travelDetail.formattedDateString}</Text>
              </View>

              {/* 留白区域，避免最底部的内容被底部栏挡住 */}
              <View style={{ height: 52 }}></View>
            </View>
          </>
        ) : (
          <Text style={styles.loading}>加载中...</Text>  //组件还没有加载出来前的显示
        )}
      </ScrollView>
      <View style={styles.footer}>
        {/* 底部栏 */}
        <TouchableOpacity style={styles.footerIcon}>
          {/* 点赞按钮 */}
          <AntDesign name="like2" size={24} color={liked ? "red" : "black"} onPress={() => handleLike(cardId)} />
          {travelDetail ? <Text style={[styles.footerText, { color: liked ? "red" : "black" }]}>{travelDetail.likedCount}</Text> : <Text style={[styles.footerText, { color: liked ? "red" : "black" }]}></Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerIcon} onPress={handleShare}>
          {/* 分享按钮 */}
          <SimpleLineIcons name="share-alt" size={24} color="black" />
          <Text style={styles.footerText}>分享</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerIcon} onPress={() => handleCollect(cardId)}>
          {/* 收藏按钮 */}
          <MaterialCommunityIcons name="heart-plus-outline" size={24} color={collected ? "red" : "black"} />
          {travelDetail ? <Text style={[styles.footerText, { color: collected ? "red" : "black" }]}>{travelDetail.collectedCount}</Text> : <Text style={[styles.footerText, { color: liked ? "red" : "black" }]}></Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
};


const screenHeight = Dimensions.get('window').height;
// 样式表
const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold'
  },
  image_contain: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 15,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  locationText: {
    color: 'black',
    marginRight: 10,
    fontSize: 12,
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
  detailTime: {
    marginTop: 12,
    fontSize: 13,
    color: '#646464'
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
})

export default DetailScreen;