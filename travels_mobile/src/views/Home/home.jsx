import WaterfallFlow from 'react-native-waterfall-flow'
import { View, Dimensions, Image, Animated, TextInput, ActivityIndicator, Text, Platform, TouchableOpacity, StyleSheet } from 'react-native'
import Button from 'apsl-react-native-button'
import { useNavigation } from '@react-navigation/native';
import { Menu, Divider } from 'react-native-paper';
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { NGROK_URL } from '../../config/ngrok'
import {  getToken, removeToken } from '../../util/tokenRelated'
import { setUser, clearUser } from '../../redux/userSlice';
import { Entypo } from '@expo/vector-icons';

const window = Dimensions.get('window')


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
        <FadeImage
          source={{ uri: item.uri, width: item.width, height: item.height }}
          resizeMode="cover"  // resizeMode设置图片的覆盖模式
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


const AvatarMenu = () => {
  // 顶部头像菜单组件
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false); //控制头像下拉菜单显隐
  const dispatch = useDispatch();
  const userInfo = useSelector(state => state.user);  //redux获取用户数据
  const [token, setToken] = useState(null);  //token鉴权
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = await getToken();
      setToken(token); 
      if (token) {
        // 由token鉴权请求后端用户信息
        axios.get(NGROK_URL + '/users/getUserInfo', { headers: { 'token': token } })
          .then(res => {
            const { avatar, nickname, _id, collectTravels, likeTravels } = res.data;
            const uniqueCollectTravels = [...new Set(collectTravels)];
            const uniqueLikeTravels = [...new Set(likeTravels)];
            // 使用 dispatch 将用户信息保存到 Redux
            dispatch(setUser({
              avatar: avatar,
              nickname: nickname,
              id: _id,
              collectTravels: uniqueCollectTravels,
              likeTravels: uniqueLikeTravels
            }));
          })
          .catch(err => {
            console.error(err);
          });
      }
    };
    fetchUserInfo();
  }, [dispatch]); // 添加dispatch到依赖项列表，保证稳定性

  const onLogout = () => {
    // 退出登录函数
    removeToken();
    dispatch(clearUser());
    navigation.navigate("登录界面");
  };

  // 控制下拉菜单显隐
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <Menu
    // 下拉菜单组件
      visible={visible}
      onDismiss={closeMenu}
      anchor={
        // 挂载在头像上
        <TouchableOpacity onPress={openMenu}>
          <Image
            source={userInfo.avatar ? { uri: userInfo.avatar } : { uri: "https://5b0988e595225.cdn.sohucs.com/images/20171114/bc48840fb6904dd4bd8f6a8af8178af4.png" }}
            style={{ width: 36, height: 36, borderRadius: 18 }}
          />
        </TouchableOpacity>
      }
      anchorPosition={'bottom'}
      contentStyle={{ marginTop:'2%', marginLeft: 3, backgroundColor: '#fff', width: 140 }}
    >
      {/* 菜单项 */}
      {userInfo.id ? (
        <>
          <Menu.Item title="写游记" leadingIcon="square-edit-outline" onPress={() => { navigation.navigate('游记发布'); closeMenu(); }} />
          <Divider />
          <Menu.Item title="我的游记" leadingIcon="account" onPress={() => { navigation.navigate('我的游记'); closeMenu(); }} />
          <Divider />
          <Menu.Item title="退出登录" leadingIcon="logout" onPress={onLogout} />
        </>
      ) : (
          <Menu.Item title="登录" leadingIcon="login" onPress={() => navigation.navigate("登录界面")} />
      )}
    </Menu>
  );
};


const Header = ({ searchText, setSearchText, handleSearch }) => {
  // 顶部组件;包括头像菜单,搜索框
  return (
    <View style={{ flexDirection: "row", marginRight: 16, marginTop: 16,height:45 }}>
      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
        {/* 头像菜单 */}
        <AvatarMenu></AvatarMenu>
      </View>
      <View style={{ flex: 3 }}>
        {/* 搜索框 */}
        <TextInput
          style={{ height: 35, width: 260, borderColor: 'gray', borderWidth: 1, paddingLeft: 10, borderRadius: 20, borderColor: "#2196F3",fontSize: 14 }}
          placeholder="请输入您要搜索的内容"
          onChangeText={searchText => setSearchText(searchText)}
          defaultValue={searchText}
        />
      </View >
      <View style={{ flex: 1 }}>
        <Button
          style={{ backgroundColor: '#2196F3', height: 35, borderRadius: 20, borderColor: "#2196F3" }}
          textStyle={{ fontSize: 18, color: "white" }}
          onPress={handleSearch}
        >搜索</Button>
      </View>
    </View>
  )
};


export default HomeScreen = () => {
  const [data, setData] = useState([]);  //首页瀑布流卡片数据
  const [refreshing, setRefreshing] = useState(false);  //刷新状态控制
  const [noMore, setNoMore] = useState(false);  //没有更多内容状态
  const [inited, setInited] = useState(false);  
  const page = useRef(0);  //页码
  const pageSize = 6;  //每页的卡片数
  const loading = useRef(false);  //加载状态
  const listRef = useRef(null);  //瀑布流组件
  const [searchText, setSearchText] = useState('');  //搜索内容
  const [isSearching, setIsSearching] = useState(false);  //搜索状态
  const [showScrollToTopButton, setShowScrollToTopButton] = useState(false);  // 控制返回顶部按钮
  
  const handleScroll = (event) => {
    // 控制返回顶部按钮显隐
    const scrollY = event.nativeEvent.contentOffset.y;
    if (scrollY > 800) { // 假设滚动超过100单位距离显示按钮
      setShowScrollToTopButton(true);
    } else {
      setShowScrollToTopButton(false);
    }
  };

  const scrollToTop = () => {
    // 瀑布流组件返回顶部
    listRef.current.scrollToOffset({ animated: true, offset: 0 });
  };

  const handleSearch = async () => {
    // 搜索操作
    setIsSearching(true);
    if (searchText.trim() === '') {
      loadData(true);
      setIsSearching(false);
      return;
    }
    try {
      const response = await axios.get(`${NGROK_URL}/travels/search`, {
        params: {
          query: searchText // 使用state中保存的searchText作为查询参数
        }
      });
      const travels = response.data.data;  //返回数据
      const formattedData = travels.map(travel => {
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
      setData(formattedData);  //存入data
    } catch (error) {
      console.error("搜索请求失败:", error);
    }
  };

  useEffect(() => {
    // 搜索完毕,顶部下拉刷新,新加载原始数据
    if (!isSearching) {
      loadData(true); 
    }
  }, [isSearching]);

  const loadData = async (isRefreshing = false) => {
    if (isRefreshing){
      // 刷新操作时重置页码到0，加载下一页
      page.current=0;
      setIsSearching(false);
    }
    if(isSearching){
      // 搜索中直接返回
      return;
    }
    
    // 下一页页码,由nextPage请求后端数据
    const nextPage = isRefreshing ? 1 : page.current + 1;
    if (loading.current && !isRefreshing) {
      // 如果当前正在加载数据，且不是刷新操作，则直接返回
      return;
    }
    loading.current = true;  //加载状态
    if (isRefreshing) {
      setRefreshing(true);  //刷新状态
    }

    try {
      // 由nextPage,pageSize请求后端数据
      const response = await axios.get(`${NGROK_URL}/travels/getTravels`, {
        params: { page: nextPage, pageSize: pageSize },
      })
      const travels = response.data.travels;
      // 格式化数据
      const formattedData = travels.map(travel => {
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

      // 如果是刷新操作，则使用新数据替换旧数据；否则，追加到现有数据之后
      setData(prevData => isRefreshing ? formattedData : [ ...prevData,...formattedData]);
      if (!isRefreshing) {
        // 如果不是刷新操作，且返回的数据小于pageSize,说明没有更多内容了
        setNoMore(formattedData.length < pageSize);
      }
      page.current = nextPage; // 更新当前页码
    } catch (err) {
      console.error(err);
    } finally {
      // 更新状态
      setRefreshing(false);
      setInited(true);
      loading.current = false;
    }
  };

  return (
    <View style={{ flex: 1}}>
      <View style={{backgroundColor:'white'}}>
        {/* 顶部组件 */}
        <Header searchText={searchText} setSearchText={setSearchText} handleSearch={handleSearch}/>
      </View>
      
      {/* 瀑布流 */}
      <WaterfallFlow
      ref={listRef}
      style={{ flex: 1, marginTop: 8 }}
      contentContainerStyle={{ backgroundColor: 'rgb(243,243,243)' }}
      ListFooterComponent={<Footer noMore={noMore} inited={inited} isEmpty={data.length === 0} isSearching={isSearching} />}
      ListEmptyComponent={<Empty inited={inited} isSearching={isSearching}/>}
      data={data}  //驱动数据
      numColumns={2}  //列数
      initialNumToRender={10}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      onEndReached={() => loadData(false)}  //触发加载更多
      refreshing={refreshing}
      onRefresh={() => loadData(true)}  //触发刷新
      onEndReachedThreshold={0}  //底部碰触阈值
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

      {
        // 返回顶部按钮
        showScrollToTopButton &&
        <TouchableOpacity
          onPress={scrollToTop}
          style={styles.scrollToTopButton}
        >
          <Entypo name="chevron-thin-up" size={14} color="white" />
          <Text style={styles.buttonText}>顶部</Text>
        </TouchableOpacity>
      }
    </View>
  );
};

const Footer = ({ noMore, inited, isEmpty,isSearching }) => {
  // 底部组件
  if (!inited || isEmpty) {
    return null;
  }
  //搜索状态底部显示
  if (isSearching) {
    return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 60 }}>
      <Text style={{ color: '#999', marginLeft: 8 }}>没有更多内容了~</Text>
    </View>
    )
  }
  //
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 60 }}>
      {!noMore && <ActivityIndicator color="red" />}
      <Text style={{ color: '#999', marginLeft: 8 }}>{noMore ? '我是有底线的哦~' : '加载中...'}</Text>
    </View>
  );
};

const Empty = ({ inited,isSearching }) => {
  // 空数据底部组件
  if(isSearching){
    return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 300 }}>
      <Text style={{ color: '#999', marginLeft: 8 }}>抱歉，没有您要找的内容哦~</Text>
    </View>
    )
  }
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 300 }}>
      {!inited && <ActivityIndicator color="red" />}
      <Text style={{ color: '#999', marginLeft: 8 }}>{inited ? '这里空空的哦~' : '获取数据中...'}</Text>
    </View>
  );
};

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

// 样式表
const styles = StyleSheet.create({
  scrollToTopButton: {
    alignItems: 'center',
    position: 'absolute',
    right: 12,
    bottom: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 4,
    borderRadius: 6,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
  },
});