import * as React from 'react';
import 'react-native-gesture-handler';
import HomeScreen from './Home/home';
import MyTravelsScreen from './MyTravels/myTravels';
import AddTravelsScreen from './AddTravels/addTravels';
import { Image, View, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();

export default function MainScreen() {
  function LogoTitle() {
    return (
      <View style={{ flexDirection: 'row', width: 370, alignItems: 'center', justifyContent: 'center' }}>
        <Image
          style={{ width: 50, height: 50 }}
          source={require("../../assets/my_icon.png")}
        />
        <Text style={{ fontSize: 20 }}>游记发布</Text>
      </View>
    );
  }
  // 主界面布局Tab导航器配置
  return (
    <Tab.Navigator // 底部导航栏 
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === '首页') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === '游记发布') {
            iconName = focused ? 'add' : 'add-outline';
          } else if (route.name === '我的') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2196F3', // tabBar被激活后的颜色
        tabBarInactiveTintColor: 'black', // tabBar没有被激活的颜色
        tabBarHideOnKeyboard: 'ture' // 调出键盘tabBar就会隐藏
      })}
    >
      <Tab.Screen name="首页" component={HomeScreen} options={{
        headerShown: false,
      }} />
      <Tab.Screen name="游记发布" component={AddTravelsScreen} options={{
        headerTitle: (props) => <LogoTitle {...props} />
      }} />
      <Tab.Screen name="我的" component={MyTravelsScreen} options={{
        headerShown: false,
      }} />
    </Tab.Navigator>
  )
}