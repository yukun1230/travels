import * as React from 'react';
import { View, StyleSheet, Text, Dimensions, ScrollView, Image, TouchableOpacity, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { FontAwesome6 } from '@expo/vector-icons';
import { Menu, Divider, Card, Title, Paragraph } from 'react-native-paper';
import {  useState } from 'react'
const FirstRoute = () => (
  <View style={[styles.scene]} >
    <ScrollView>
      <Card style={styles.card}>
        <View style={styles.topContainer}>
          <Image
            source={{ uri: "https://img0.baidu.com/it/u=4245625267,1147908887&fm=253&fmt=auto&app=120&f=JPEG?w=1422&h=800" }}
            style={styles.image}
          />
          <View style={styles.textContainer}>
            <Title
              numberOfLines={1}
              ellipsizeMode='tail'
              style={styles.title}
            >
              标题可能非常非常长标题标题标题标题标题标题标题标题标题
            </Title>
            <Paragraph
              numberOfLines={3}
              ellipsizeMode='tail'
              style={styles.paragraph}
            >
              详细信息和描述可能也会很长很长描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述
            </Paragraph>
          </View>
        </View>
        <Card.Actions style={styles.bottomContainer}>
          <View style={styles.statusContainer}>
            <Text style={styles.status}>已通过</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => { }}>
              <Text style={styles.buttonText}>删除</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.editButton]} onPress={() => { }}>
              <Text style={{ color:'#007BFF' }}>编辑</Text>
            </TouchableOpacity>
          </View>
        </Card.Actions>
      </Card>
      <Card style={styles.card}>
        <View style={styles.topContainer}>
          <Image
            source={{ uri: "https://img0.baidu.com/it/u=4245625267,1147908887&fm=253&fmt=auto&app=120&f=JPEG?w=1422&h=800" }}
            style={styles.image}
          />
          <View style={styles.textContainer}>
            <Title
              numberOfLines={1}
              ellipsizeMode='tail'
              style={styles.title}
            >
              标题可能非常非常长标题标题标题标题标题标题标题标题标题
            </Title>
            <Paragraph
              numberOfLines={3}
              ellipsizeMode='tail'
              style={styles.paragraph}
            >
              详细信息和描述可能也会很长很长描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述
            </Paragraph>
          </View>
        </View>
        <Card.Actions style={styles.bottomContainer}>
          <View style={styles.statusContainer}>
            <Text style={styles.status}>已通过</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => { }}>
              <Text style={styles.buttonText}>删除</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.editButton]} onPress={() => { }}>
              <Text style={{ color: '#007BFF' }}>编辑</Text>
            </TouchableOpacity>
          </View>
        </Card.Actions>
      </Card>
      <Card style={styles.card}>
        <View style={styles.topContainer}>
          <Image
            source={{ uri: "https://img0.baidu.com/it/u=4245625267,1147908887&fm=253&fmt=auto&app=120&f=JPEG?w=1422&h=800" }}
            style={styles.image}
          />
          <View style={styles.textContainer}>
            <Title
              numberOfLines={1}
              ellipsizeMode='tail'
              style={styles.title}
            >
              标题可能非常非常长标题标题标题标题标题标题标题标题标题
            </Title>
            <Paragraph
              numberOfLines={3}
              ellipsizeMode='tail'
              style={styles.paragraph}
            >
              详细信息和描述可能也会很长很长描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述
            </Paragraph>
          </View>
        </View>
        <Card.Actions style={styles.bottomContainer}>
          <View style={styles.statusContainer}>
            <Text style={styles.status}>已通过</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => { }}>
              <Text style={styles.buttonText}>删除</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.editButton]} onPress={() => { }}>
              <Text style={{ color: '#007BFF' }}>编辑</Text>
            </TouchableOpacity>
          </View>
        </Card.Actions>
      </Card>
      <Card style={styles.card}>
        <View style={styles.topContainer}>
          <Image
            source={{ uri: "https://img0.baidu.com/it/u=4245625267,1147908887&fm=253&fmt=auto&app=120&f=JPEG?w=1422&h=800" }}
            style={styles.image}
          />
          <View style={styles.textContainer}>
            <Title
              numberOfLines={1}
              ellipsizeMode='tail'
              style={styles.title}
            >
              标题可能非常非常长标题标题标题标题标题标题标题标题标题
            </Title>
            <Paragraph
              numberOfLines={3}
              ellipsizeMode='tail'
              style={styles.paragraph}
            >
              详细信息和描述可能也会很长很长描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述
            </Paragraph>
          </View>
        </View>
        <Card.Actions style={styles.bottomContainer}>
          <View style={styles.statusContainer}>
            <Text style={styles.status}>已通过</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => { }}>
              <Text style={styles.buttonText}>删除</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.editButton]} onPress={() => { }}>
              <Text style={{ color: '#007BFF' }}>编辑</Text>
            </TouchableOpacity>
          </View>
        </Card.Actions>
      </Card>
    </ScrollView>
  </View>
);

const SecondRoute = () => (
  <View style={[styles.scene]} >
    <ScrollView>
      <Card style={styles.card}>
        <View style={styles.topContainer}>
          <Image
            source={{ uri: "https://img0.baidu.com/it/u=4245625267,1147908887&fm=253&fmt=auto&app=120&f=JPEG?w=1422&h=800" }}
            style={styles.image}
          />
          <View style={styles.textContainer}>
            <Title
              numberOfLines={1}
              ellipsizeMode='tail'
              style={styles.title}
            >
              标题可能非常非常长标题标题标题标题标题标题标题标题标题
            </Title>
            <Paragraph
              numberOfLines={3}
              ellipsizeMode='tail'
              style={styles.paragraph}
            >
              详细信息和描述可能也会很长很长描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述
            </Paragraph>
          </View>
        </View>
        <Card.Actions style={styles.bottomContainer}>
          <View style={styles.likeUser}>
            <Image
              source={{ uri: "https://img0.baidu.com/it/u=1303418658,2016567117&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889" }}
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,}}/>
            <Text style={{marginLeft:10}}>收藏用户昵称</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.editButton]} onPress={() => { }}>
              <Text style={{ color: '#007BFF' }}>详情</Text>
            </TouchableOpacity>
          </View>
        </Card.Actions>
      </Card>
    </ScrollView>
  </View>
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
    { key: 'first', title: '我的游记' },
    { key: 'second', title: '我的收藏' },
  ]);
  const renderTabBar = props => (
    <TabBar
      {...props}
      activeColor="rgb(34,150,243)" 
      inactiveColor="gray" 
      indicatorStyle={{ backgroundColor: "rgb(34, 150, 243)" }} 
      style={{
        backgroundColor: 'white', 
        borderTopWidth: 2, 
        borderBottomWidth: 2, 
        borderColor: 'grey', 

      }}
      labelStyle={{
        fontWeight: 'bold' 
      }}
    />
  );

  


  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
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
        </View>
        
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
  card: {
    margin: 10,
    overflow: 'hidden', 
    backgroundColor: 'white',
  },
  topContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
  },
  paragraph: {
    color: 'gray',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 6,
  },
  statusContainer: {
    justifyContent: 'center',
    alignItems: 'center', 
    marginRight: 150,
    width: 60,
    height: 30,
    borderRadius: 8,
    backgroundColor: "rgb(81,178,127)"
  },
  status: {
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: "white", 
    width: 60,
    height: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1, 
    borderColor: "#d32f2f",
  },
  buttonText: {
    color: '#d32f2f',
  },
  editButton: {
    borderColor: '#007BFF', 
  },
  likeUser:{
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  }
});