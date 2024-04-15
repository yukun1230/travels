import React, { useState, useCallback, useRef } from 'react';
import { View, StyleSheet, Text, Dimensions, ScrollView, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect ,Animated } from '@react-navigation/native';
import WaterfallFlow from 'react-native-waterfall-flow'
import { TabView, TabBar } from 'react-native-tab-view';
import { FontAwesome6 } from '@expo/vector-icons';
import { Menu, Divider } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from '../../redux/userSlice';
import { getToken, removeToken } from '../../util/tokenRelated';
import MyTravelCard from './MyTravelCard'    //我的游记卡片组件
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
      contentStyle={{ marginTop: -45, marginLeft: 3, backgroundColor: '#fff', width: 140 }}
    >
      {/* 菜单栏选项根据有无用户信息动态调整 */}
      {userInfo.id ? (
        <>
          <Menu.Item title="逛一逛" leadingIcon="home-outline" onPress={() => { navigation.navigate('首页'); closeMenu(); }} />
          <Divider />
          <Menu.Item title="修改信息" leadingIcon="account-details-outline" onPress={() => { navigation.navigate('修改用户信息'); closeMenu(); }} />
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
  const [refreshing, setRefreshing] = useState(false);  //下拉刷新
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
      <ScrollView refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={fetchTravels}
          tintColor="#000"
          colors={["#000"]}
        />}
      >
        {content}
      </ScrollView>
    </View>
  );
};


const Card = ({ item }) => {
  // 卡片组件
  //点击卡片跳转详情页并传递卡片的id
  const navigation = useNavigation();
  const onPressCard = () => {
    navigation.navigate('Detail', { cardId: item._id });
  };
  return (
    <View style={{ flex: 1, overflow: 'hidden', borderRadius: 10 }}>
      <TouchableOpacity
        style={{ backgroundColor: '#fff', flex: 1 }}
        activeOpacity={0.5}  // 被触摸操作时的透明度（0-1）
        onPress={() => {onPressCard(),console.log(item.uri,item.width,item.height);}}   // 跳转详情页
      >
        <Image
          source={{ uri: item.uri }}
          style={{ width: item.width, height: item.height }}
        />
        <View style={{ padding: 10 }}>
          {/* 标题 */}
          <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{item.title}</Text>
          <View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
            {/* 用户资料 */}
            <Image
              source={{ uri: item.avatar }}
              style={{ width: 20, height: 20, borderRadius: 10 }}
            />
            <Text style={{ fontSize: 12, marginLeft: 5 }}>{item.nickname}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}


const SecondRoute = ({ collectedTravels, fetchTravels, isLoading }) => {
  // 我的收藏路由渲染
  const [refreshing, setRefreshing] = useState(false);  //下拉刷新
  const listRef = useRef(null);
  return (
    <View style={[styles.scene]}>
      {collectedTravels.length===0 ? 
         <View style={{ padding: 20 }}><Text style={{ fontSize: 18 }}>您还没有收藏任何游记哦，快去收藏一篇吧~</Text></View>
      : 
        <WaterfallFlow
        ref={listRef}
        style={{ flex: 1, marginTop: 0,paddingTop:6 }}
        contentContainerStyle={{ backgroundColor: 'rgb(243,243,243)' }}
        ListFooterComponent={<View style={{ paddingBottom:10,alignSelf:'center' }}><Text style={{ fontSize: 14 }}>没有更多内容了~</Text></View>}
        data={collectedTravels}  //驱动数据
        numColumns={2}  //列数
        initialNumToRender={10}
        scrollEventThrottle={16}
        refreshing={refreshing}
        onRefresh={() => fetchTravels()}  //触发刷新
        renderItem={({ item, index, columnIndex }) => {
          return (
            <View
              style={{
                // 内边距设置
                paddingLeft: columnIndex === 0 ? 12 : 6,
                paddingRight: columnIndex === 0 ? 6 : 12,
                paddingTop: 6,
                paddingBottom: 6
              }}
            >
              <Card item={item}/>
            </View>
          );
        }}
      />
      }
    </View>
  );
}


const ThirdRoute = ({ collectedTravels, fetchTravels, isLoading }) => {
  // 我的收藏路由渲染
  const [refreshing, setRefreshing] = useState(false);  //下拉刷新
  const listRef = useRef(null);
  return (
    <View style={[styles.scene]}>
      {collectedTravels.length===0 ? 
         <View style={{ padding: 20 }}><Text style={{ fontSize: 18 }}>您还没有收藏任何游记哦，快去收藏一篇吧~</Text></View>
      : 
        <WaterfallFlow
        ref={listRef}
        style={{ flex: 1, marginTop: 0,paddingTop:6 }}
        contentContainerStyle={{ backgroundColor: 'rgb(243,243,243)' }}
        ListFooterComponent={<View style={{ paddingBottom:10,alignSelf:'center' }}><Text style={{ fontSize: 14 }}>没有更多内容了~</Text></View>}
        data={collectedTravels}  //驱动数据
        numColumns={2}  //列数
        initialNumToRender={10}
        scrollEventThrottle={16}
        refreshing={refreshing}
        onRefresh={() => fetchTravels()}  //触发刷新
        renderItem={({ item, index, columnIndex }) => {
          return (
            <View
              style={{
                // 内边距设置
                paddingLeft: columnIndex === 0 ? 12 : 6,
                paddingRight: columnIndex === 0 ? 6 : 12,
                paddingTop: 6,
                paddingBottom: 6
              }}
            >
              <Card item={item}/>
            </View>
          );
        }}
      />
      }
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
    { key: 'third', title: '我的点赞' },
    { key: 'fourth', title: '我的草稿' },
  ]);
  const [myTravels, setMyTravels] = useState([]);  //存放我的游记数据
  const [collectedTravels, setCollectedTravels] = useState([]);  //存放我的收藏数据
  const [isLoading, setIsLoading] = useState(true);  //加载态
  const window = Dimensions.get('window')

  const fetchTravels = async () => {
    // 从后端获取我的游记和我的收藏数据存入state状态
    console.log(1);
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
      // console.log(response2.data.result[0].photo);
      if (response1.data.MyTravels) {
        setMyTravels(response1.data.MyTravels);
      };
      if (response2.data.result) {
        
        const formattedCollectedData = response2.data.result.map(travel => {
        // 格式化数据
        const firstPhoto = travel.photo[0] ? travel.photo[0] : { uri: '', width: 0, height: 0 };
        return {
          _id: travel._id,
          uri: firstPhoto.uri,
          title: travel.title,
          width: Math.floor(window.width / 2),
          height: Math.floor(firstPhoto.height / firstPhoto.width * Math.floor(window.width / 2)),
          avatar: travel.userInfo.avatar,
          nickname: travel.userInfo.nickname,
        };
      });
      // console.log(formattedData);

      setCollectedTravels(formattedCollectedData);

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
        return <FirstRoute myTravels={myTravels} fetchTravels={fetchTravels} isLoading={isLoading} />;
      case 'second':
        return <SecondRoute collectedTravels={collectedTravels} fetchTravels={fetchTravels} isLoading={isLoading} />;
      case 'third':
        return <ThirdRoute collectedTravels={collectedTravels} fetchTravels={fetchTravels} isLoading={isLoading} />;
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
      indicatorStyle={{
        backgroundColor: "rgb(34,150,243)",
        width: '10%',
        marginLeft: '5.5%',
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
          style={{ flexDirection: 'row', alignItems: 'center' }}
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
        /> :
        <UnLoginScreen></UnLoginScreen>// 未登录显示组件
      }
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
    paddingBottom: 0,
    marginTop: 0
  },
  nickname: {
    marginLeft: 12,
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
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});