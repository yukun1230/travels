import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, Platform, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { NGROK_URL } from '../../../config/ngrok';
import { AntDesign } from '@expo/vector-icons';
import MyDialog from '../../../components/myDialog';
import { setUser } from '../../../redux/userSlice';
import { getToken } from '../../../util/tokenRelated';
import Toast from 'react-native-toast-message';
import axios from 'axios';


const FadeImage = (props) => {
  const _animatedValue = useRef(new Animated.Value(0)).current;
  const { style, onLoadEnd } = props;
  if (Platform.OS === 'android') {
    return <Image {...props} />;
  }
  return (
    <Animated.Image
      {...props}
      onLoadEnd={() => {
        Animated.timing(_animatedValue, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
        onLoadEnd && onLoadEnd();
      }}
      style={[style, { opacity: _animatedValue }]}
    />
  );
};

const Card = ({ item }) => {
  const dispatch = useDispatch();  //redux状态修改
  const userInfo = useSelector(state => state.user);
  const navigation = useNavigation();
  const cardId = item._id;
  const [visible, setVisible] = useState(false);  //取消收藏对话框显隐
  const [isRequesting, setIsRequesting] = useState(false);  //请求状态控制,防止多次点赞收藏请求
  const [collectedCount, setCollectedCount] = useState(0);
  const [collected, setCollected] = useState(false);

  const onPressCard = () => navigation.navigate('Detail', { cardId: item._id });
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  useEffect(() => {
    setCollectedCount(item.collectedCount)
    setCollected(userInfo.collectTravels ? userInfo.collectTravels.includes(item._id) : false)
  }, [userInfo.collectTravels, item._id]);


  useEffect(() => {
    setCollectedCount(item.collectedCount);
  }, [item.collectedCount]); // 添加依赖项

  const handleCollect = async (cardId) => {// 处理收藏逻辑
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
          // 更新用户redux收藏游记信息
          dispatch(setUser({
            ...userInfo,
            collectTravels: [...userInfo.collectTravels, cardId],
          }));
          setCollectedCount(collectedCount + 1)
        } else {
          console.log('收藏失败', response.data.message);
        }
      } else {
        // 打开取消收藏对话框
        showDialog()
      }
    } catch (error) {
      console.error('收藏请求失败:', error);
    }
  };

  const cancelCollected = async (cardId) => {// 取消收藏逻辑
    setIsRequesting(true);
    const token = await getToken();
    try {
      const response = await axios.post(`${NGROK_URL}/travels/UndoCollectTravel`, { travelId: cardId }, { headers: { 'token': token } });
      setIsRequesting(false);
      if (response.data.message === '取消收藏成功') {
        setCollected(false); // 更新状态
        dispatch(setUser({
          ...userInfo,
          collectTravels: userInfo.collectTravels.filter(item => item !== cardId),
        }));
        setCollectedCount(collectedCount - 1)
      } else {
        console.log('取消收藏失败', response.data.message);
      };
      // 关闭对话框
      hideDialog();
    } catch (error) {
      console.error('点赞请求失败:', error);
    }
  }

  return (
    <View style={styles.aboveAll}>
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
      <TouchableOpacity
        style={{ backgroundColor: '#fff', flex: 1 }}
        activeOpacity={0.5}  // 被触摸操作时的透明度（0-1）
        onPress={() => onPressCard()}   // 跳转详情页
      >
        <FadeImage
          source={{ uri: item.uri, width: item.width, height: item.height }}
          resizeMode="cover"  // resizeMode设置图片的覆盖模式
        />
      </TouchableOpacity>
      <View style={{ padding: 10, backgroundColor: 'white' }}>
        {/* 标题 */}
        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{item.title}</Text>

        <View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* 用户资料 */}
            <Image
              source={{ uri: item.avatar }}
              style={{ width: 20, height: 20, borderRadius: 10 }}
            />
            <Text style={{ fontSize: 12, marginLeft: 5 }}>{item.nickname}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={
                () => handleCollect(cardId)
              }>
              {collected ? <AntDesign style={{ marginRight: 3, marginTop: 2 }} name="heart" size={16} color="red" /> : <AntDesign style={{ marginRight: 3, marginTop: 2 }} name="hearto" size={16} color="black" />}
            </TouchableOpacity>
            <Text>
              {collectedCount}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  aboveAll: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 10
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
  },
});

export default Card;