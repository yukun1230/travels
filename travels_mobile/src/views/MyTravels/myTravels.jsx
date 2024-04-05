import React, { useEffect, useLayoutEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Text, Dimensions, ScrollView, Image, TouchableOpacity, Button } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { FontAwesome6 } from '@expo/vector-icons';
import { Menu, Divider, Card, Title, Paragraph } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { setUser, clearUser } from '../../redux/userSlice';
import { storeToken, getToken, removeToken } from '../../util/tokenRelated';
import MyTravelCard from './MyTravelCard'
import MyLikeCard from './MyLikeCard';
import axios from 'axios';
import { NGROK_URL } from '../../config/ngrok'


const travelCardsData = [{
    id: '1',
    imageUrl: "https://img0.baidu.com/it/u=4245625267,1147908887&fm=253&fmt=auto&app=120&f=JPEG?w=1422&h=800",
    title: "探索未知的地方",
    content: "这是关于我的第一次旅行的一段描述...",
    status: 1
  },
  {
    id: '2',
    imageUrl: "https://img0.baidu.com/it/u=4245625267,1147908887&fm=253&fmt=auto&app=120&f=JPEG?w=1422&h=800",
    title: "探索未知的地方2",
    content: "这是关于我的第一次旅行的一段描述2...",
    status: 2
  },
  {
    id: '3',
    imageUrl: "https://img0.baidu.com/it/u=4245625267,1147908887&fm=253&fmt=auto&app=120&f=JPEG?w=1422&h=800",
    title: "探索未知的地方3",
    content: "这是关于我的第一次旅行的一段描述3...",
    status: 0
  },
]

const likedTravelsData = [
  {
    id: '1',
    imageUrl: "https://img0.baidu.com/it/u=4245625267,1147908887&fm=253&fmt=auto&app=120&f=JPEG?w=1422&h=800",
    title: "秋天的童话",
    content: "秋天，是一年中最美的季节，枫叶红了...",
    userAvatar: "https://img0.baidu.com/it/u=4245625267,1147908887&fm=253&fmt=auto&app=120&f=JPEG?w=1422&h=800",
    userName: "小明"
  },
  {
    id: '2',
    imageUrl: "https://img0.baidu.com/it/u=4245625267,1147908887&fm=253&fmt=auto&app=120&f=JPEG?w=1422&h=800",
    title: "秋天的童话2",
    content: "秋天，是一年中最美的季节，枫叶红了2...",
    userAvatar: "https://img0.baidu.com/it/u=4245625267,1147908887&fm=253&fmt=auto&app=120&f=JPEG?w=1422&h=800",
    userName: "小明"
  },

];



const AvatarMenu = () => {
  // 头像菜单组件
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const userInfo = useSelector(state => state.user);
  // const [token, setToken] = useState(null);
  const onLogout = () => {
    removeToken();
    dispatch(clearUser());
    navigation.navigate("登录界面");
  };
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);




  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const token = await getToken();
  //       console.log(token);
  //       const response = await axios.get(`${NGROK_URL}/travels/getMyTravels`, {
  //         headers: { 'token': token },
  //       });
  //       console.log(response.data);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  //   fetchData();
  // }, []);








  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={
        <TouchableOpacity onPress={openMenu}>
          <Image
            source={userInfo.avatar ? { uri: userInfo.avatar } : { uri: "https://5b0988e595225.cdn.sohucs.com/images/20171114/bc48840fb6904dd4bd8f6a8af8178af4.png" }}
            // source={userInfo.avatar ? { uri: userInfo.avatar } : { uri: "https://i0.hdslb.com/bfs/article/39e49451cb2e97b3e80a5c290c65b916a6a9db67.jpg" }}
            style={{ width: 36, height: 36, borderRadius: 18 }}
          />
        </TouchableOpacity>
      }
      anchorPosition={'bottom'}
      contentStyle={{ marginTop: 10, marginLeft: 3, backgroundColor: '#fff', width: 140 }}
    >
      {/* Menu items */}
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


const FirstRoute = ({ myTravels }) => (
  <View style={[styles.scene]}>
    <ScrollView>
      {myTravels.map((travel) => (
        <MyTravelCard
          key={travel._id}
          id={travel._id}
          imageUrl={travel.photo[0] ? travel.photo[0].uri : '默认图片地址'}
          title={travel.title}
          content={travel.content}
          status={travel.travelState}
        />
      ))}
    </ScrollView>
  </View>
);


const SecondRoute = () => {
  // 我的收藏组件
  const navigation = useNavigation();
  return (
    <View style={[styles.scene]} >
      <ScrollView>
        <MyLikeCard
        // 我的收藏卡片组件
          key={likedTravelsData[0].id}
          id={likedTravelsData[0].id}
          imageUrl={likedTravelsData[0].imageUrl}
          title={likedTravelsData[0].title}
          content={likedTravelsData[0].content}
          userAvatar={likedTravelsData[0].userAvatar}
          userName={likedTravelsData[0].userName}
        />
        <MyLikeCard
          key={likedTravelsData[1].id}
          id={likedTravelsData[1].id}
          imageUrl={likedTravelsData[1].imageUrl}
          title={likedTravelsData[1].title}
          content={likedTravelsData[1].content}
          userAvatar={likedTravelsData[1].userAvatar}
          userName={likedTravelsData[1].userName}
        />
      </ScrollView>
    </View>
  )
}
  
 
const initialLayout = { width: Dimensions.get('window').width };
// const renderScene = SceneMap({
//   // 选项卡配置
//   first: FirstRoute,
//   second: SecondRoute,
// });

export default function MyTravelsScreen() {
  const userInfo = useSelector(state => state.user);
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  const [routes] = React.useState([
    { key: 'first', title: '我的游记' },
    { key: 'second', title: '我的收藏' },
  ]);
  const [myTravels, setMyTravels] = useState([]);
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const token = await getToken();
          const response = await axios.get(`${NGROK_URL}/travels/getMyTravels`, {
            headers: { 'token': token },
          });
          console.log(response.data.MyTravels);
          if (response.data && response.data.MyTravels) {
            setMyTravels(response.data.MyTravels);
          }
        } catch (err) {
          console.error(err);
        }
      };

      fetchData();
    }, [])
  );



  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'first':
        return <FirstRoute myTravels={myTravels} />;
      case 'second':
        return <SecondRoute likedTravelsData={likedTravelsData} />;
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
        width: '5%',  // 设置指示器宽度为 tab 宽度的 80%
        marginLeft: '16.5%', // 将指示器向右移动，使得它在 tab 中居中
     }} 
      style={{
        backgroundColor: 'white', 
        // borderTopWidth: 1.5, 
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
      <View style={styles.header}>
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

      <TabView
      // 选项卡组件
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        style={styles.tabView}
        renderTabBar={renderTabBar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  header: {
    
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom:0,
    marginTop: 36
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