import * as React from 'react';
import { View, StyleSheet, Text, Dimensions, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { FontAwesome6 } from '@expo/vector-icons';
import { Menu, Divider } from 'react-native-paper';
import {  useState } from 'react'
const FirstRoute = () => (
  <View style={[styles.scene, { backgroundColor: '#ff4081' }]} >
    <ScrollView>
      {/* ScrollView的内容 */}
    </ScrollView>
  </View>
);

const SecondRoute = () => (
  <View style={[styles.scene, { backgroundColor: '#673ab7' }]} />
);

const initialLayout = { width: Dimensions.get('window').width };

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
});

export default function MyTravelsScreen() {
  const navigation = useNavigation();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'First' },
    { key: 'second', title: 'Second' },
  ]);
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Menu
          // 下拉菜单
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <View >
              <TouchableOpacity onPress={openMenu}>
                <Image
                  source={{ uri: "https://i0.hdslb.com/bfs/article/39e49451cb2e97b3e80a5c290c65b916a6a9db67.jpg" }}
                  style={styles.avatar}
                />
              </TouchableOpacity>
            </View>}
          anchorPosition={'bottom'}
          contentStyle={{ marginTop: 10, marginLeft: 3, backgroundColor: '#fff', width: 140 }}
        >
          <Menu.Item
            title="逛一逛"
            leadingIcon="home-outline"
            onPress={() => { navigation.navigate('首页'), closeMenu() }}
          />
          <Divider />
          <Menu.Item
            title="写游记"
            leadingIcon="square-edit-outline"
            onPress={() => { navigation.navigate('游记发布'), closeMenu() }}
          />
          <Divider />
          <Menu.Item
            title="退出登录"
            leadingIcon="logout"
            onPress={() => console.log('Item 1 pressed')}
          />
        </Menu>
        
        <Text style={styles.nickname}>用户昵称</Text>
        <TouchableOpacity
          style={{flexDirection: 'row',alignItems: 'center'}}
          onPress={() => navigation.navigate('游记发布')}>
          <FontAwesome6 name="add" size={24} color="rgb(34,150,243)" />
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "rgb(34,150,243)", marginLeft: 8 }}>新增</Text>
        </TouchableOpacity>

      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        style={styles.tabView}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 180,
    backgroundColor: "white"
  },
  header: {
    
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    marginTop: 36
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  nickname: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  scene: {
    flex: 1,
  },
  tabView: {
    flex: 1,
  }
});