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
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                {/* 观看次数 */}
                <AntDesign name="eyeo" size={14} color="black" />
                <Text style={{ fontSize: 12 }}>10000</Text>
              </View>
            </View>
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
            const { avatar, nickname, _id } = res.data;
            // const nickname = res.data.avatar;
            // 使用 dispatch 将用户信息保存到 Redux
            // console.log(res.data);
            dispatch(setUser({
              avatar: avatar,
              nickname: nickname,
              id: _id
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




const Header = () => {
  // 头部组件
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
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
          style={{ height: 35, width: 260, borderColor: 'gray', borderWidth: 1, padding: 10, borderRadius: 20, borderColor: "#2196F3" }}
          placeholder="请输入您要搜索的内容"
          onChangeText={searchText => setSearchText(searchText)}
          defaultValue={searchText}
        />
      </View >
      <View style={{ flex: 1, }}>
        <Button
          style={{ backgroundColor: '#2196F3', height: 35, borderRadius: 20, borderColor: "#2196F3" }}
          textStyle={{ fontSize: 18, color: "white" }}
        >搜索
        </Button>
      </View>
    </View>
  )
}

export default HomeScreen = () => {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [noMore, setNoMore] = useState(false);
  const [inited, setInited] = useState(false);

  const page = useRef(1);
  const pageSize = 6;
  const loading = useRef(false);
  const listRef = useRef(null);
  // const [isLoading, setIsLoading] = useState(false);


  




  // useEffect(() => {
  //   axios.get(`${NGROK_URL}/travels/getDetails`, {
  //     params: { id: "660d5b4977d1fe0ef4ab3e26" },
  //   }) .then(res => {
  //           console.log(res.data);
  //         })
  //         .catch(err => {
  //           console.error(err);
  //         });
  //     }
  // , []); 


  // const CardList = [
  //   {
  //     "_id": "660d5b4977d1fe0ef4ab3e27",
  //     "uri": "https://img1.baidu.com/it/u=2226443709,1655735334&fm=253&fmt=auto&app=120&f=JPEG?w=690&h=1226",
  //     "title": "尾页,好看的风景锁屏壁纸,唯美天空手机壁纸",
  //     "width": 690,
  //     "height": 1226,
  //     "avatar": "https://img1.baidu.com/it/u=2226443709,1655735334&fm=253&fmt=auto&app=120&f=JPEG?w=690&h=1226",
  //     "nickname": "套娃定律"
  //   },]
  // const [cardList, setCardList] = useState([]);
  // useEffect(() => {
  //   const fetchCardList = async () => {
  //     setIsLoading(true); // 开始加载数据
  //     try {
  //       const response = await axios.get(NGROK_URL + '/travels/getTravels');
  //       const travels = response.data.travels;
  //       const formattedData = travels.map(travel => {
  //         // 取第一个照片作为展示，确保photo数组不为空
  //         const firstPhoto = travel.photo[0] ? travel.photo[0] : { uri: '', width: 0, height: 0 };
  //         return {
  //           _id: travel._id,
  //           uri: firstPhoto.uri,
  //           title: travel.title,
  //           width: firstPhoto.width,
  //           height: firstPhoto.height,
  //           avatar: travel.userInfo.avatar,
  //           nickname: travel.userInfo.nickname,
  //         };
  //       });
  //       setCardList(formattedData); // 更新卡片列表数据
  //       // console.log(formattedData);
  //     } catch (err) {
  //       console.error(err);
  //     } finally {
  //       setIsLoading(false); // 完成加载，无论请求成功还是失败
  //     }
  //   };
  //   fetchCardList();
  // }, []);
  // useEffect(() => {
  //   console.log(cardList,'abc');
  // }, [cardList]);
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


  

  // const loadData = (page = 1, refreshing) => {
    
  //   if (loading.current) {
  //     return;
  //   }
  //   loading.current = true;
  //   if (refreshing) {
  //     setRefreshing(true);
  //   }
  //   setIsLoading(true);
  //     const newData = cardList.slice((page - 1) * pageSize, page * pageSize).map(img => {
  //       const { width, height } = img;
  //       const cardWidth = Math.floor(window.width / 2);
  //       return {
  //         ...img,
  //         width: cardWidth,
  //         height: Math.floor(height / width * cardWidth)
  //       };
  //     });
  //     const noMore = newData.length < pageSize;
  //     loading.current = false;
  //     page.current = refreshing ? 1 : page;
  //     setData(prevData => refreshing ? newData : [...prevData, ...newData]);
  //     setRefreshing(false);
  //     setNoMore(noMore);
  //     setInited(true);
  //     setIsLoading(false);
  // };

  // const loadData = async (isRefreshing = false) => {
  //   const cardWidth = Math.floor(window.width / 2);
  //   if (loading.current && !isRefreshing) {
  //     // 如果当前正在加载数据，且不是刷新操作，则直接返回
  //     return;
  //   }

  //   loading.current = true;
  //   setIsLoading(true);
  //   if (isRefreshing) {
  //     setRefreshing(true);
  //   }

  //   try {
  //     // 直接请求所有数据，无需分页参数
  //     const response = await axios.get(`${NGROK_URL}/travels/getTravels`);
  //     const travels = response.data.travels;

  //     // 处理获取到的数据
  //     const formattedData = travels.map(travel => {
  //       const firstPhoto = travel.photo[0] ? travel.photo[0] : { uri: '', width: 0, height: 0 };
  //       return {
  //         _id: travel._id,
  //         uri: firstPhoto.uri,
  //         title: travel.title,
  //         width: cardWidth,
  //         height: Math.floor(firstPhoto.height / firstPhoto.width * cardWidth),
  //         avatar: travel.userInfo.avatar,
  //         nickname: travel.userInfo.nickname,
  //       };
  //     });

  //     // 使用新数据替换旧数据
  //     setData(formattedData);
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setIsLoading(false);
  //     setRefreshing(false);
  //     setInited(true);
  //     loading.current = false;
  //   }
  // };
  const loadData = async (isRefreshing = false) => {
    // 刷新操作时重置页码到1，否则加载下一页
    // console.log('当前页',page);
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
        params: { page: page.current, pageSize: pageSize },
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
      <Header />
      
      <WaterfallFlow
      ref={listRef}
      style={{ flex: 1, marginTop: 40 }}
      contentContainerStyle={{ backgroundColor: 'rgb(243,243,243)' }}
      ListFooterComponent={<Footer noMore={noMore} inited={inited} isEmpty={data.length === 0} />}
      ListEmptyComponent={<Empty inited={inited} />}
      data={data}
      numColumns={2}
      initialNumToRender={10}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      onEndReached={() => loadData(false)}
      refreshing={refreshing}
      onRefresh={() => loadData(true)}
      onEndReachedThreshold={0.1} 
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

const Footer = ({ noMore, inited, isEmpty }) => {
  if (!inited || isEmpty) {
    return null;
  }
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 60 }}>
      {!noMore && <ActivityIndicator color="red" />}
      <Text style={{ color: '#999', marginLeft: 8 }}>{noMore ? '我是有底线的哦~' : '加载中...'}</Text>
    </View>
  );
};

const Empty = ({ inited }) => {
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