import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions, ScrollView, Image, TouchableOpacity, RefreshControl, ImageBackground } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import WaterfallFlow from 'react-native-waterfall-flow'
import { Menu, Divider } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from '../../redux/userSlice';
import { getToken, removeToken } from '../../util/tokenRelated';
import MyTravelCard from './MyTravelCard'    //我的游记卡片组件
import axios from 'axios';
import { NGROK_URL } from '../../config/ngrok'
import UnLoginScreen from '../../components/unLogin';
import LoadingOverlay from '../../components/LoadingOverlay';
import { Tabs } from 'react-native-collapsible-tab-view'
import { Foundation } from '@expo/vector-icons';


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
  useEffect(() => console.log(userInfo), [])

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={
        <TouchableOpacity onPress={() => { openMenu(), console.log(userInfo) }}>
          <Image
            // 没有头像设置一个默认头像
            source={userInfo.avatar ? { uri: userInfo.avatar } : { uri: "https://5b0988e595225.cdn.sohucs.com/images/20171114/bc48840fb6904dd4bd8f6a8af8178af4.png" }}
            style={{ width: 76, height: 76, borderRadius: 38 }}
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
  // const [refreshing, setRefreshing] = useState(false);  //下拉刷新
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
      {content}
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
        onPress={() => onPressCard()}   // 跳转详情页
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
      {collectedTravels.length === 0 ?
        <View style={{ padding: 20 }}><Text style={{ fontSize: 18 }}>您还没有收藏任何游记哦，快去收藏一篇吧~</Text></View>
        :
        <WaterfallFlow
          ref={listRef}
          // nestedScrollEnabled={true}
          style={{ flex: 1, marginTop: 0, paddingTop: 6 }}
          contentContainerStyle={{ backgroundColor: 'rgb(243,243,243)' }}
          ListFooterComponent={<View style={{ paddingBottom: 10, alignSelf: 'center' }}><Text style={{ fontSize: 14 }}>没有更多内容了~</Text></View>}
          data={collectedTravels}  //驱动数据
          numColumns={2}  //列数
          initialNumToRender={10}
          scrollEventThrottle={16}
          refreshing={refreshing}
          scrollEnabled={false}
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
                <Card item={item} />
              </View>
            );
          }}
        />
      }
    </View>
  );
}


const ThirdRoute = ({ likedTravels, fetchTravels, isLoading }) => {
  // 我的点赞路由渲染
  const [refreshing, setRefreshing] = useState(false);  //下拉刷新
  const listRef = useRef(null);
  return (
    <View style={[styles.scene]}>
      {likedTravels.length === 0 ?
        <View style={{ padding: 20 }}><Text style={{ fontSize: 18 }}>您还没有点赞过游记哦~</Text></View>
        :
        <WaterfallFlow
          ref={listRef}
          // nestedScrollEnabled={true}
          style={{ flex: 1, marginTop: 0, paddingTop: 6 }}
          contentContainerStyle={{ backgroundColor: 'rgb(243,243,243)' }}
          ListFooterComponent={<View style={{ paddingBottom: 10, alignSelf: 'center' }}><Text style={{ fontSize: 14 }}>没有更多内容了~</Text></View>}
          data={likedTravels}  //驱动数据
          numColumns={2}  //列数
          initialNumToRender={10}
          scrollEventThrottle={16}
          refreshing={refreshing}
          scrollEnabled={false}
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
                <Card item={item} />
              </View>
            );
          }}
        />
      }
    </View>
  );
}

const FourthRoute = ({ draftTravels, fetchTravels, isLoading }) => {
  const userInfo = useSelector(state => state.user);  //redux获取用户信息
  // 我的草稿
  // 根据条件判断要渲染的内容
  // const [refreshing, setRefreshing] = useState(false);  //下拉刷新
  const content = draftTravels.length !== 0 ? (
    // 根据传进来的myTravels数据映射渲染
    draftTravels.map((travel) => (
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
    !isLoading && <View style={{ padding: 20 }}><Text style={{ fontSize: 18 }}>您的草稿箱是空的哦~</Text></View>
  );
  return (
    <View style={[styles.scene]}>
      {content}
    </View>
  );
};


export default function MyTravelsScreen() {
  const userInfo = useSelector(state => state.user);  //redux获取用户信息
  const navigation = useNavigation();
  const [myTravels, setMyTravels] = useState([]);  //存放我的游记数据
  const [collectedTravels, setCollectedTravels] = useState([]);  //存放我的收藏数据
  const [likedTravels, setlikedTravels] = useState([]);  //存放我的点赞数据
  const [draftTravels, setDraftTravels] = useState([]);  //存放我的草稿数据
  const [refreshing, setRefreshing] = useState(false)
  const [isLoading, setIsLoading] = useState(true);  //加载态
  const window = Dimensions.get('window')

  const fetchTravels = async () => {
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
      const response3 = await axios.get(`${NGROK_URL}/travels/getlikedTravels`, {
        headers: { 'token': token },
      });
      const response4 = await axios.get(`${NGROK_URL}/travels/getDraftTravels`, {
        headers: { 'token': token },
      });
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
        setCollectedTravels(formattedCollectedData);
      }
      if (response3.data.result) {
        const formattedlikedData = response3.data.result.map(travel => {
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
        setlikedTravels(formattedlikedData);
      }
      if (response4.data.MyTravels) {
        setDraftTravels(response4.data.MyTravels);
      };
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

  const MyHeader = () => {
    const userInfo = useSelector(state => state.user);
    return (
      <View >
        <ImageBackground source={require("../../../assets/login.png")}
          style={{ flex: 1 }}
        >
          <View style={styles.header}>
            <View style={styles.userInfo}>
              <AvatarMenu></AvatarMenu>
              <View style={{ marginLeft: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.nickname}>{userInfo.id ? userInfo.nickname : "未登录"}</Text>
                  <View style={{ marginLeft: 8 }}>
                    {userInfo.gender === '男' && <Foundation name="male-symbol" size={28} color="#4169E1" />}
                    {userInfo.gender === '女' && <Foundation name="female-symbol" size={28} color="#FF69B4" />}
                  </View>
                </View>
                <Text style={{ marginTop: 10, fontSize: 14, color: 'grey' }}>用户名：{userInfo.id ? userInfo.username : "xxxxxx"}</Text>
              </View>
            </View>
            {userInfo.id ? <TouchableOpacity
              // 新增按钮
              style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: "rgb(34,150,243)", borderRadius: 5 }}
              onPress={() => navigation.navigate('游记发布')}>
              <Text style={{ fontSize: 18, fontWeight: "bold", color: "rgb(34,150,243)", margin: 6 }}>写游记</Text>
            </TouchableOpacity> :
              <TouchableOpacity
                // 新增按钮
                style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: "rgb(34,150,243)", borderRadius: 5 }}
                onPress={() => navigation.navigate('登录界面')}>
                <Text style={{ fontSize: 18, fontWeight: "bold", color: "rgb(34,150,243)", margin: 6 }}>去登录</Text>
              </TouchableOpacity>
            }
          </View>
          <View style={{ paddingHorizontal: 40, paddingVertical: 20 }}><Text style={{ fontSize: 16, color: 'grey' }}>简介：{userInfo.introduction ? userInfo.introduction : '此用户还未填写简介'}</Text></View>
        </ImageBackground>
      </View>)
  }

  return (
    <View style={styles.container}>
      <LoadingOverlay isVisible={isLoading} />
      {/* 根据是否登录判断是否渲染选项卡组件 */}
      <Tabs.Container renderHeader={MyHeader} activeColor='blue' >
        <Tabs.Tab name={'A'} label={'游记'} >
          <Tabs.ScrollView refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={fetchTravels}
              tintColor="#000"
              colors={["#000"]}
            />}>
            <FirstRoute myTravels={myTravels} fetchTravels={fetchTravels} isLoading={isLoading} />
          </Tabs.ScrollView>
        </Tabs.Tab>
        <Tabs.Tab name={'B'} label={'收藏'}>
          <Tabs.ScrollView>
            <SecondRoute collectedTravels={collectedTravels} fetchTravels={fetchTravels} isLoading={isLoading} />
          </Tabs.ScrollView>
        </Tabs.Tab>
        <Tabs.Tab name={'C'} label={'点赞'}>
          <Tabs.ScrollView >
            <ThirdRoute likedTravels={likedTravels} fetchTravels={fetchTravels} isLoading={isLoading} />
          </Tabs.ScrollView>
        </Tabs.Tab>
        <Tabs.Tab name={'D'} label={'草稿'}>
          <Tabs.ScrollView refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={fetchTravels}
              tintColor="#000"
              colors={["#000"]}
            />}>
            <FourthRoute draftTravels={draftTravels} fetchTravels={fetchTravels} isLoading={isLoading} />
          </Tabs.ScrollView>
        </Tabs.Tab>
      </Tabs.Container>
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
    padding: 30,
    paddingBottom: 10,
    marginTop: 0
  },
  nickname: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scene: {
    flex: 1,
    backgroundColor: 'rgb(243,243,243)'
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});