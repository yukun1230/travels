import WaterfallFlow from 'react-native-waterfall-flow'
import { View, Dimensions, Image, Animated, TextInput, ActivityIndicator, Text, Platform, TouchableOpacity, Modal, StyleSheet } from 'react-native'
import Button from 'apsl-react-native-button'
import imgList from './imgList'
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { Menu, Divider } from 'react-native-paper';
import { useDispatch } from 'react-redux'
import React, { useState, useEffect, useRef } from 'react';

const window = Dimensions.get('window')

const Card = ({ item, index, columnIndex }) => {
  //点击卡片跳转详情页并传递卡片的id
  // const onPressCard = (id) => {
  //   navigation.navigate('Detail', { cardId: id });
  // };
  const navigation = useNavigation();
  const onPressCard = () => {
    navigation.navigate('Detail');
  };

  return (
    <View style={{ flex: 1, overflow: 'hidden', borderRadius: 10 }}>
      <TouchableOpacity
        style={{ backgroundColor: '#fff', flex: 1 }}
        activeOpacity={0.5}  // 设置指定封装的视图在被触摸操作时的透明度（0-1）
        onPress={() => onPressCard()}   // 跳转
      >
        <FadeImage
          source={{ uri: item.thumbURL, width: item.width, height: item.height }}
          resizeMode="cover"  // resizeMode用来设置图片的缩放模式
        />
        <View style={{ padding: 10 }}>
          {/* 标题 */}
          <Text style={{ fontSize: 14, fontWeight: 'bold' }}>这是标题~~这是标题~~这是标题~~</Text>
          <View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
            {/* 用户资料 */}
            <Image
              source={{ uri: "https://i0.hdslb.com/bfs/article/39e49451cb2e97b3e80a5c290c65b916a6a9db67.jpg" }}
              style={{ width: 20, height: 20, borderRadius: 10 }}
            />
            <Text style={{ fontSize: 12, marginLeft: 5 }}>用户昵称</Text>
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

const Header = () => {
  // 头部组件
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const dispatch = useDispatch();
  // 退出登录
  const onLogout = () => {
    // dispatch(changePage())
    navigation.navigate("登录界面")
  }

  return (
    <View style={{ flexDirection: "row", marginRight: 16, marginTop: 16 }}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        {/* 头像 */}
        <Menu
          // 下拉菜单
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <View >
              <TouchableOpacity onPress={openMenu}>
                <Image
                  source={{ uri: "https://5b0988e595225.cdn.sohucs.com/images/20171114/bc48840fb6904dd4bd8f6a8af8178af4.png" }}
                  style={{ width: 36, height: 36, borderRadius: 18 }}
                />
              </TouchableOpacity>
            </View>}
          anchorPosition={'bottom'}
          contentStyle={{ marginTop: 10, marginLeft: 3, backgroundColor: '#fff', width: 140 }}
        >
          <Menu.Item
            title="写游记"
            leadingIcon="square-edit-outline"
            onPress={() => { navigation.navigate('游记发布'), closeMenu() }}
          />
          <Divider />
          <Menu.Item
            title="我的游记"
            leadingIcon="account"
            onPress={() => { navigation.navigate('我的游记'), closeMenu() }}
          />
          <Divider />
          <Menu.Item
            title="退出登录"
            leadingIcon="logout"
            onPress={onLogout}
          />
        </Menu>
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
  const pageSize = 10;
  const loading = useRef(false);
  const listRef = useRef(null);


  useEffect(() => {
    loadData(1);

    setTimeout(() => {
      // 测试 WaterfallFlow 的方法
      // listRef.current.scrollToIndex({ index: 6 });
      // listRef.current.scrollToEnd();
      // listRef.current.scrollToOffset({ offset: 200 });
    }, 3000);
  }, []);

  const loadData = (page = 1, refreshing) => {
    if (loading.current) {
      return;
    }
    loading.current = true;
    if (refreshing) {
      setRefreshing(true);
    }
    setTimeout(() => { // 模拟请求数据
      const newData = imgList.slice((page - 1) * pageSize, page * pageSize).map(img => {
        const { width, height } = img;
        const cardWidth = Math.floor(window.width / 2);
        return {
          ...img,
          width: cardWidth,
          height: Math.floor(height / width * cardWidth)
        };
      });
      const noMore = newData.length < pageSize;
      loading.current = false;
      page.current = refreshing ? 1 : page;
      setData(prevData => refreshing ? newData : [...prevData, ...newData]);
      setRefreshing(false);
      setNoMore(noMore);
      setInited(true);
    }, refreshing ? 1000 : 500);
  };

  const onEndReached = () => {
    if (!noMore) {
      loadData(page.current + 1);
    }
  };

  return (
    <WaterfallFlow
      ref={listRef}
      style={{ flex: 1, marginTop: 40 }}
      contentContainerStyle={{ backgroundColor: 'rgb(243,243,243)' }}
      ListHeaderComponent={<Header />}
      ListFooterComponent={<Footer noMore={noMore} inited={inited} isEmpty={data.length === 0} />}
      ListEmptyComponent={<Empty inited={inited} />}
      data={data}
      numColumns={2}
      initialNumToRender={10}
      onEndReached={onEndReached}
      refreshing={refreshing}
      onRefresh={() => loadData(1, true)}
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

