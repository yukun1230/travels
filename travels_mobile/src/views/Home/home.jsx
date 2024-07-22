import WaterfallFlow from 'react-native-waterfall-flow'
import { View, Dimensions, ActivityIndicator, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native'
import React, { useState, useEffect, useRef } from 'react';
import {  useDispatch } from 'react-redux';
import axios from 'axios';
import { NGROK_URL } from '../../config/ngrok';
import { getToken } from '../../util/tokenRelated';
import { setUser } from '../../redux/userSlice';
import Card from './components/Card';
import Header from './components/Header';
import { Entypo } from '@expo/vector-icons';
const window = Dimensions.get('window')

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
  const [token, setToken] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = await getToken();
      setToken(token);
      if (token) {
        // 由token鉴权请求后端用户信息
        axios.get(NGROK_URL + '/users/getUserInfo', { headers: { 'token': token } })
          .then(res => {
            const { avatar, nickname, _id,gender, introduction, collectTravels, likeTravels, username} = res.data;
            const uniqueCollectTravels = [...new Set(collectTravels)];
            const uniqueLikeTravels = [...new Set(likeTravels)];
            dispatch(setUser({// 使用 dispatch 将用户信息保存到 Redux
              avatar: avatar,
              nickname: nickname,
              username: username,
              id: _id,
              gender: gender,
              introduction : introduction,
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
  }, [dispatch]);

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
    if (isRefreshing) {
      // 刷新操作时重置页码到0，加载下一页
      page.current = 0;
      setIsSearching(false);
    }
    if (isSearching) {
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
          collectedCount: travel.collectedCount,
        };
      });
      // 如果是刷新操作，则使用新数据替换旧数据；否则，追加到现有数据之后
      setData(prevData => isRefreshing ? formattedData : [...prevData, ...formattedData]);
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
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="white" barStyle='dark-content' />
      <View style={{ backgroundColor: 'white' }}>
        {/* 顶部组件 */}
        <Header searchText={searchText} setSearchText={setSearchText} handleSearch={handleSearch} />
      </View>

      {/* 瀑布流 */}
      <WaterfallFlow
        ref={listRef}
        style={{ flex: 1, marginTop: 0, paddingTop: 6 }}
        contentContainerStyle={{ backgroundColor: 'rgb(243,243,243)' }}
        ListFooterComponent={<Footer noMore={noMore} inited={inited} isEmpty={data.length === 0} isSearching={isSearching} />}
        ListEmptyComponent={<Empty inited={inited} isSearching={isSearching} />}
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
            <View index={index}
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

      {showScrollToTopButton && // 返回顶部按钮
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

const Footer = ({ noMore, inited, isEmpty, isSearching }) => {
  // 底部组件
  if (!inited || isEmpty) {
    return null;
  }
  if (isSearching) { //搜索状态底部显示
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

const Empty = ({ inited, isSearching }) => {
  // 空数据底部组件
  if (isSearching) {
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