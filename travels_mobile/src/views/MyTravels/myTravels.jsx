import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Text, Dimensions, ScrollView, Image, TouchableOpacity, Button } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { TabView, TabBar } from 'react-native-tab-view';
import { FontAwesome6 } from '@expo/vector-icons';
import { Menu, Divider } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from '../../redux/userSlice';
import { getToken, removeToken } from '../../util/tokenRelated';
import MyTravelCard from './MyTravelCard'    //我的游记卡片组件
import MyLikeCard from './MyLikeCard';     //我的收藏卡片组件
import axios from 'axios';
import { NGROK_URL } from '../../config/ngrok'
import UnLoginScreen from '../../components/unLogin';
import LoadingOverlay from '../../components/LoadingOverlay'; 


const AvatarMenu = () => {
  // 头像菜单组件
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);  //下拉菜单显隐
  const dispatch = useDispatch();
  const userInfo = useSelector(state => state.user);  //redux获取用户数据

  const onLogout = () => {
    // 退出登录
    removeToken();  //清楚Token
    dispatch(clearUser());  //重置redux数据
    navigation.navigate("登录界面");  //跳转登录页
  };

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={
        <TouchableOpacity onPress={openMenu}>
          <Image
          // 没有头像设置一个默认头像
            source={userInfo.avatar ? { uri: userInfo.avatar } : { uri: "https://5b0988e595225.cdn.sohucs.com/images/20171114/bc48840fb6904dd4bd8f6a8af8178af4.png" }}
            style={{ width: 36, height: 36, borderRadius: 18 }}
          />
        </TouchableOpacity>
      }
      anchorPosition={'bottom'}
      contentStyle={{ marginTop: 10, marginLeft: 3, backgroundColor: '#fff', width: 140 }}
    >
      {/* 菜单栏选项根据有无用户信息动态调整 */}
      {userInfo.id ? (
        <>
          <Menu.Item title="逛一逛" leadingIcon="home-outline" onPress={() => { navigation.navigate('首页'); closeMenu(); }} />
          <Divider />
          <Menu.Item title="写游记" leadingIcon="square-edit-outline" onPress={() => { navigation.navigate('游记发布'); closeMenu(); }} />
          <Divider />
          <Menu.Item title="退出登录" leadingIcon="logout" onPress={onLogout} />
        </>
      ) : (
        <Menu.Item title="登录" leadingIcon="login" onPress={() => navigation.navigate("登录界面")} />
      )}
    </Menu>
  );
};


const FirstRoute = ({ myTravels, fetchTravels, isLoading }) => {
  // 我的游记路由
  // 根据条件判断要渲染的内容
  const content = myTravels.length !== 0 ? (
    // 根据传进来的myTravels数据映射渲染
    myTravels.map((travel) => (
      <MyTravelCard
        key={travel._id}
        id={travel._id}
        photo={travel.photo}
        title={travel.title}
        content={travel.content}
        status={travel.travelState}
        location={travel.location ? travel.location : {}}
        rejectedReason={travel.rejectedReason ? travel.rejectedReason : ''}
        fetchTravels={fetchTravels}
      />
    ))
  ) : (
    !isLoading && <View style={{ padding: 20 }}><Text style={{ fontSize: 18 }}>您还没有发布过游记哦，快去发布一篇吧~</Text></View>
  );

  return (
    <View style={[styles.scene]}>
      <ScrollView>
        {content}
      </ScrollView>
    </View>
  );
};


const SecondRoute = ({ collectedTravels, fetchTravels, isLoading }) => {
  // 我的收藏路由渲染
   const content = collectedTravels.length !== 0 ? (
    collectedTravels.map((travel) => (
      <MyLikeCard
        key={travel._id}
        id={travel._id}
        imageUrl={travel.photo[0].uri}
        title={travel.title}
        content={travel.content}
        userAvatar={travel.userInfo.avatar}
        nickname={travel.userInfo.nickname}
        fetchTravels={fetchTravels}
      />
    ))
  ) : (
    !isLoading && <View style={{ padding: 20 }}><Text style={{ fontSize: 18 }}>您还没有收藏任何游记哦，快去收藏一篇吧~</Text></View>
  );
  return (
    <View style={[styles.scene]}>
      <ScrollView>
        {content}
      </ScrollView>
    </View>
  );
}
  
 
const initialLayout = { width: Dimensions.get('window').width };  //选项卡配置

export default function MyTravelsScreen() {
  const userInfo = useSelector(state => state.user);  //redux获取用户信息
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);  //选项卡路由跳转
  const [routes] = useState([
    { key: 'first', title: '我的游记' },
    { key: 'second', title: '我的收藏' },
  ]);
  const [myTravels, setMyTravels] = useState([]);  //存放我的游记数据
  const [collectedTravels, setCollectedTravels] = useState([]);  //存放我的收藏数据
  const [isLoading, setIsLoading] = useState(true);  //加载态

  const fetchTravels = async () => {
    // 从后端获取我的游记和我的收藏数据存入state状态
    try {
      const token = await getToken();
      if (!token) {
        setIsLoading(false);
        return
      }
      const response1 = await axios.get(`${NGROK_URL}/travels/getMyTravels`, {
        headers: { 'token': token },
      });
      const response2 = await axios.get(`${NGROK_URL}/travels/getCollectedTravels`, {
        headers: { 'token': token },
      });
      if (response1.data.MyTravels) {
        setMyTravels(response1.data.MyTravels);
      };
      if (response2.data.result) {
        setCollectedTravels(response2.data.result);
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.error(err);
    }
  };

  useFocusEffect(
    // 获取路由焦点自动调用fetchTravels更新状态数据
    useCallback(() => {
      fetchTravels();
    }, [])
  );


  const renderScene = ({ route }) => {
    // 选项卡组件渲染
    switch (route.key) {
      case 'first':
        return <FirstRoute myTravels={myTravels} fetchTravels={fetchTravels} isLoading={isLoading}/>;
      case 'second':
        return <SecondRoute collectedTravels={collectedTravels} fetchTravels={fetchTravels} isLoading={isLoading} />;
      default:
        return null;
    }
  };
  
  const renderTabBar = props => (
    // 选项栏配置
    <TabBar
      {...props}
      activeColor="rgb(34,150,243)" 
      inactiveColor="gray" 
      indicatorStyle={{ backgroundColor: "rgb(34,150,243)",
        width: '5%',  
        marginLeft: '16.5%', 
     }} 
      style={{
        backgroundColor: 'white', 
        borderBottomWidth: 0.1, 
        borderColor: 'grey', 

      }}
      labelStyle={{
        fontWeight: 'bold' 
      }}
    />
  );


  return (
    <View style={styles.container}>
      {/* 加载态组件 */}
      <LoadingOverlay isVisible={isLoading} />
      <View style={styles.header}>
        {/* 头部组件 */}
        <View style={styles.userInfo}>
          <AvatarMenu></AvatarMenu>
          <Text style={styles.nickname}>{userInfo.nickname}</Text>
        </View>
        <TouchableOpacity
          // 新增按钮
          style={{flexDirection: 'row',alignItems: 'center'}}
          onPress={() => navigation.navigate('游记发布')}>
          <FontAwesome6 name="add" size={24} color="rgb(34,150,243)" />
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "rgb(34,150,243)", marginLeft: 8 }}>新增</Text>
        </TouchableOpacity>
      </View>
      {/* 根据是否登录判断是否渲染选项卡组件 */}
      {userInfo.id ? 
      <TabView
        // 选项卡组件
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        style={styles.tabView}
        renderTabBar={renderTabBar}
      />: 
      // 未登录显示组件
      <UnLoginScreen></UnLoginScreen>}
    </View>
  );
}

// 样式表
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  header: {
    
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom:0,
    marginTop: 0
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  nickname: {
    marginLeft:12,
    fontSize: 18,
    fontWeight: 'bold',
  },
  scene: {
    flex: 1,
    backgroundColor: 'rgb(243,243,243)'
  },
  tabView: {
    flex: 1,

  },
  userInfo:{
    flexDirection: 'row',
    alignItems: 'center',
  },
});