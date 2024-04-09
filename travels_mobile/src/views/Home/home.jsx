import WaterfallFlow from 'react-native-waterfall-flow'
import { View, Dimensions, Image, Animated, TextInput, ActivityIndicator, Text, Platform, TouchableOpacity, Modal, StyleSheet } from 'react-native'
import Button from 'apsl-react-native-button'
// import imgList from './imgList'
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { Menu, Divider } from 'react-native-paper';
import React, { useState, useEffect, useRef } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import axios from 'axios';
import { NGROK_URL } from '../../config/ngrok'
import { storeToken, getToken, removeToken } from '../../util/tokenRelated'
import { setUser, clearUser } from '../../redux/userSlice';
import LoadingOverlay from '../../components/LoadingOverlay'; 
import { Entypo } from '@expo/vector-icons';

const window = Dimensions.get('window')

const Card = ({ item, index, columnIndex }) => {
  //点击卡片跳转详情页并传递卡片的id
  // const onPressCard = (id) => {
  //   navigation.navigate('Detail', { cardId: id });
  // };
  const navigation = useNavigation();
  const onPressCard = () => {
    // console.log(item._id);
    navigation.navigate('Detail', { cardId: item._id });
  };

  return (
    <View style={{ flex: 1, overflow: 'hidden', borderRadius: 10 }}>
      <TouchableOpacity
        style={{ backgroundColor: '#fff', flex: 1 }}
        activeOpacity={0.5}  // 设置指定封装的视图在被触摸操作时的透明度（0-1）
        onPress={() => onPressCard()}   // 跳转
      >
        <FadeImage
          source={{ uri: item.uri, width: item.width, height: item.height }}
          resizeMode="cover"  // resizeMode用来设置图片的缩放模式
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
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const userInfo = useSelector(state => state.user);
  const [token, setToken] = useState(null);
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = await getToken();
      setToken(token); 
      if (token) {
        axios.get(NGROK_URL + '/users/getUserInfo', { headers: { 'token': token } })
          .then(res => {
            const { avatar, nickname, _id, collectTravels, likeTravels } = res.data;
            const uniqueCollectTravels = [...new Set(collectTravels)];
            const uniqueLikeTravels = [...new Set(likeTravels)];
            // console.log(res.data);
            console.log(uniqueCollectTravels,uniqueLikeTravels);
            // const nickname = res.data.avatar;
            // 使用 dispatch 将用户信息保存到 Redux
            // console.log(res.data);
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
  }, [dispatch]); // 添加 dispatch 到依赖项列表，保证稳定性

  const onLogout = () => {
    removeToken();
    dispatch(clearUser());
    navigation.navigate("登录界面");
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
            source={userInfo.avatar ? { uri: userInfo.avatar } : { uri: "https://5b0988e595225.cdn.sohucs.com/images/20171114/bc48840fb6904dd4bd8f6a8af8178af4.png" }}
            style={{ width: 36, height: 36, borderRadius: 18 }}
          />
        </TouchableOpacity>
      }
      anchorPosition={'bottom'}
      contentStyle={{ marginTop: 32, marginLeft: 3, backgroundColor: '#fff', width: 140 }}
    >
      {/* Menu items */}
      {token ? (
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
  // 头部组件
  const navigation = useNavigation();
  
  const dispatch = useDispatch();
  return (
    <View style={{ flexDirection: "row", marginRight: 16, marginTop: 56,height:8 }}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        {/* 头像 */}
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
      <View style={{ flex: 1, }}>
        <Button
          style={{ backgroundColor: '#2196F3', height: 35, borderRadius: 20, borderColor: "#2196F3" }}
          textStyle={{ fontSize: 18, color: "white" }}
          onPress={handleSearch}
        >搜索
        </Button>
      </View>
    </View>
  )
};


export default HomeScreen = () => {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [noMore, setNoMore] = useState(false);
  const [inited, setInited] = useState(false);

  const page = useRef(0);
  const pageSize = 6;
  const loading = useRef(false);
  const listRef = useRef(null);
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
 
  // 控制返回顶部按钮
  const [showScrollToTopButton, setShowScrollToTopButton] = useState(false);
  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    if (scrollY > 800) { // 假设滚动超过100单位距离显示按钮
      setShowScrollToTopButton(true);
    } else {
      setShowScrollToTopButton(false);
    }
  };
  const scrollToTop = () => {
    listRef.current.scrollToOffset({ animated: true, offset: 0 });
    
  };

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      // 假设后端接口 URL 为 `${NGROK_URL}/travels/search`，并且接受一个名为 `query` 的查询参数
      
      
      const response = await axios.get(`${NGROK_URL}/travels/search`, {
        params: {
          query: searchText // 使用 state 中保存的 searchText 作为查询参数
        }
      });
      // console.log(response.data.data);
      const travels = response.data.data;
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
      // console.log(travels);
      // 如果是刷新操作，则使用新数据替换旧数据；否则，追加到现有数据之后
      setData(formattedData);
    } catch (error) {
      console.error("搜索请求失败:", error);
    }
  };


  useEffect(() => {
  console.log(`当前 isSearching: ${isSearching}`);
  if (!isSearching) {
    // 当结束搜索时，可能希望重新加载原始数据或执行其他操作
    console.log("结束搜索，重置或重新加载数据");
    loadData(true); // 假设这里调用了重置或重新加载数据的函数
  }
}, [isSearching]);


  



  const loadData = async (isRefreshing = false) => {
    // 刷新操作时重置页码到1，否则加载下一页
    // console.log('当前页',page);
    if (isRefreshing){
      page.current=0;
      setIsSearching(false);
      // console.log(isSearching);
    }
    if(isSearching){
      return;
    }
    
    const nextPage = isRefreshing ? 1 : page.current + 1;

    if (loading.current && !isRefreshing) {
      // 如果当前正在加载数据，且不是刷新操作，则直接返回
      return;
    }

    loading.current = true;
    // setIsLoading(true);
    if (isRefreshing) {
      setRefreshing(true);
    }

    try {
      const response = await axios.get(`${NGROK_URL}/travels/getTravels`, {
        params: { page: nextPage, pageSize: pageSize },
      })
      
      const travels = response.data.travels;
      // console.log(nextPage, pageSize);
      // console.log(travels);
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
      // console.log(1);
      if (!isRefreshing) {
        setNoMore(formattedData.length < pageSize);
      }
      page.current = nextPage; // 更新当前页码
    } catch (err) {
      console.error(err);
    } finally {
      // setIsLoading(false);
      setRefreshing(false);
      setInited(true);
      loading.current = false;
    }
  };

  // const onEndReached = () => {
  //   if (!noMore) {
  //     loadData(page.current + 1);
  //   }
  // };

  return (
    <View style={{ flex: 1}}>
      {/* <LoadingOverlay isVisible={isLoading} /> */}
      {/* <Header /> */}
       <Header searchText={searchText} setSearchText={setSearchText} handleSearch={handleSearch} />
      <WaterfallFlow
      ref={listRef}
      style={{ flex: 1, marginTop: 40 }}
      contentContainerStyle={{ backgroundColor: 'rgb(243,243,243)' }}
      ListFooterComponent={<Footer noMore={noMore} inited={inited} isEmpty={data.length === 0} isSearching={isSearching} />}
      ListEmptyComponent={<Empty inited={inited} isSearching={isSearching}/>}
      data={data}
      numColumns={2}
      initialNumToRender={10}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      onEndReached={() => loadData(false)}
      refreshing={refreshing}
      onRefresh={() => loadData(true)}
      onEndReachedThreshold={0} 
      renderItem={({ item, index, columnIndex }) => {
        return (
          <View
            style={{
              paddingLeft: columnIndex === 0 ? 12 : 6,
              paddingRight: columnIndex === 0 ? 6 : 12,
              paddingTop: 6,
              paddingBottom: 6
            }}
          >
            <Card item={item} index={index} columnIndex={columnIndex} />
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
  if (!inited || isEmpty) {
    return null;
  }


  if (isSearching) {
    return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 60 }}>
      <Text style={{ color: '#999', marginLeft: 8 }}>没有更多内容了~</Text>
    </View>
    )
  }

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 60 }}>
      {!noMore && <ActivityIndicator color="red" />}
      <Text style={{ color: '#999', marginLeft: 8 }}>{noMore ? '我是有底线的哦~' : '加载中...'}</Text>
    </View>
  );
};

const Empty = ({ inited,isSearching }) => {
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