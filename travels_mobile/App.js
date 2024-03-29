import * as React from 'react';
import 'react-native-gesture-handler';
import HomeStack from './src/views/HomeStack';
import MyTravelsScreen from './src/views/MyTravels/myTravels';
import AddTravelsScreen from './src/views/AddTravels/addTravels';
import LoginScreen from './src/views/Login/login';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
// import { store } from './src/redux/store';
// import { Provider } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import RegisterScreen from './src/views/Register/register'

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
let islogin = true

export default function App() {

  if (islogin === false) {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="登录界面" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="注册界面" component={RegisterScreen} options={{headerTitle: ''}} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
  return (
    <PaperProvider>
      <NavigationContainer>
      <Tab.Navigator  // 底部导航栏，前面应该有登录和注册页面
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {  // focused当前状态
            let iconName;
            if (route.name === '首页') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === '游记发布') {
              iconName = focused ? 'add' : 'add-outline';
            } else if (route.name === '我的游记') {
              iconName = focused ? 'person' : 'person-outline';
            }
            // 这里可以返回任何你喜欢的组件
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#2196F3',  // tabBar被激活后的颜色
          tabBarInactiveTintColor: 'black',  // tabBar没有被激活的颜色
          tabBarHideOnKeyboard: 'ture'  // 调出键盘tabBar就会隐藏
        })}
      >
        <Tab.Screen name="首页" component={HomeStack} options={{ 
          headerShown: false,
          headerStyle: {
            height: 100, 
          },
          }} />
        <Tab.Screen name="游记发布" component={AddTravelsScreen} options={{
          headerStyle: {
            height: 100,
          },
        }} />
        <Tab.Screen name="我的游记" component={MyTravelsScreen} options={{
          headerStyle: {
            height: 100,
          },
        }} />
      </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
    
  );
  
}

// { 
//   "username": {
//    "message": "",
//     "ref": { "name": "username" }, 
//     "type": "maxLength" 
//   } 
// }