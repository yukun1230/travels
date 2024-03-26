import WaterfallFlow from 'react-native-waterfall-flow'
import { View, Dimensions, Image, Animated, TextInput, ActivityIndicator, Text, Platform, TouchableOpacity } from 'react-native'
import { PureComponent, Component, useState } from 'react'
import Button from 'apsl-react-native-button'
import imgList from './imgList'
import { useNavigation } from '@react-navigation/native';


const window = Dimensions.get('window')



export default class HomeScreen extends Component {
  // constructor 会在你的类式组件 挂载（添加到屏幕上）之前运行。
  // 一般来说，在 React 中 constructor 仅用于两个目的。它可以让你来声明 state 以及将你的类方法 绑定 到你的类实例上。
  constructor(props) {
    super(props)

    this.state = {
      data: [],
      refreshing: false,
      noMore: false,
      inited: false
    }
    this.page = 1
    this.pageSize = 10
    this.loading = false
    this.listRef = null
  }
  //首次渲染完成之后调用
  componentDidMount() {

    this.loadData(1)

    setTimeout(() => { // test WaterfallFlow's methods
      // this.listRef.scrollToIndex({ index: 6 })
      // this.listRef.scrollToEnd()
      // this.listRef.scrollToOffset({ offset: 200 })
    }, 3000)
  }

  // 加载数据
  loadData = (page = 1, refreshing) => {
    if (this.loading) {
      return
    }
    this.loading = true
    if (refreshing) {
      this.setState({
        refreshing: true
      })
    }
    setTimeout(() => { // mock request data
      const newData = imgList.slice((page - 1) * this.pageSize, page * this.pageSize).map(img => {
        const { width, height } = img
        const cardWidth = Math.floor(window.width / 2)
        return {
          ...img,
          width: cardWidth,
          height: Math.floor(height / width * cardWidth)
        }
      })
      const noMore = newData.length < this.pageSize
      this.loading = false
      this.page = refreshing ? 1 : page
      this.setState({
        data: refreshing ? newData : this.state.data.concat(newData),
        refreshing: false,
        noMore,
        inited: true
      })
    }, refreshing ? 1000 : 500)
  }

  // 在最后触摸
  onEndReached = () => {
    if (!this.state.noMore) {
      this.loadData(this.page + 1)
    }
  }
  // 渲染
  render() {
    const { data, refreshing, noMore, inited } = this.state 
    return (
      <WaterfallFlow
        ref={ref => this.listRef = ref}
        style={{ flex: 1, marginTop: 40 }}
        contentContainerStyle={{ backgroundColor: '#f9f9f9' }}
        ListHeaderComponent={<Header />}
        ListFooterComponent={<Footer noMore={noMore} inited={inited} isEmpty={data.length === 0} />}
        ListEmptyComponent={<Empty inited={inited} />}
        data={data}
        numColumns={2}
        initialNumToRender={10}
        onEndReached={this.onEndReached}
        refreshing={refreshing}
        onRefresh={() => this.loadData(1, true)}
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
          )
        }}
      />
    )
  }
}

//点击卡片跳转详情页并传递卡片的id 
// const onPressCard = (id) => {
//   navigation.navigate('Detail', { cardId: id });
// };

const Card = ({ item, index, columnIndex }) => {
  const navigation = useNavigation();
  const onPressCard = () => {
    navigation.navigate('Detail');
  };

  return (
    <View style={{ flex: 1, overflow: 'hidden', borderRadius: 10}}>
      <TouchableOpacity
        style={{ backgroundColor: '#fff', flex: 1 }}
        activeOpacity={0.5}  // 设置指定封装的视图在被触摸操作时的透明度（0-1）
        onPress={() => onPressCard()}   // 跳转
      >
        <FadeImage
          source={{ uri: item.thumbURL, width: item.width, height: item.height }}
          resizeMode="cover"  // resizeMode用来设置图片的缩放模式
        />
      </TouchableOpacity>
    </View>
  )
}

const Header = () => {
  const [searchText, setSearchText] = useState('');
  return (
    <View style={{ flexDirection: "row", marginLeft:16,marginRight:16,marginTop:16 }}>
      <View style={{ flex: 3 }}>
        <TextInput
          style={{ height: 35, width: 250, borderColor: 'gray', borderWidth: 1, padding: 10, borderRadius: 20,borderColor:"#2196F3" }}
          placeholder="请输入您要搜索的内容"
          onChangeText={searchText => setSearchText(searchText)}
          defaultValue={searchText}
        />
      </View >
      <View style={{ flex: 1, }}>
        <Button
          style={{ backgroundColor: '#2196F3', height: 35, borderRadius: 20,borderColor:"#2196F3" }}
          textStyle={{ fontSize: 18, color: "white" }}
        >搜索
        </Button>
      </View>
      <View style={{ flex: 1 }}> 
        {/* 这里用于放头像 */}
      </View>
    </View>
  )
}

class Footer extends PureComponent {
  render() {
    const { noMore, inited, isEmpty } = this.props
    if (!inited || isEmpty) {
      return null
    }
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 60 }}>
        {!noMore && <ActivityIndicator color="red" />}
        <Text style={{ color: '#999', marginLeft: 8 }}>{noMore ? '我是有底线的哦~' : '加载中...'}</Text>
      </View>
    )
  }
}


class Empty extends PureComponent {
  render() {
    const { inited } = this.props
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 300 }}>
        {!inited && <ActivityIndicator color="red" />}
        <Text style={{ color: '#999', marginLeft: 8 }}>{inited ? '这里空空的哦~' : '获取数据中...'}</Text>
      </View>
    )
  }
}

class FadeImage extends Component {

  constructor(props) {
    super(props)
    this._animatedValue = new Animated.Value(0)
  }

  render() {
    const { style, onLoadEnd } = this.props
    if (Platform.OS === 'android') {
      return <Image {...this.props} />
    }
    return (
      <Animated.Image
        {...this.props}
        onLoadEnd={() => {
          Animated.timing(this._animatedValue, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true
          }).start()
          onLoadEnd && onLoadEnd()
        }}
        style={[style, { opacity: this._animatedValue }]}
      />
    )
  }
}