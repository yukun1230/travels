import * as React from 'react';
import 'react-native-gesture-handler';
import LoginScreen from './src/views/Login/login';
import MainScreen from './src/views/main';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from './src/views/Register/register'
import DetailScreen from './src/views/Detail/detail'
import editTravelScreen from './src/views/EditTravel/editTravel'
import EditUserInfoScreen from './src/views/EditUserInfo/editUserInfo';
import Toast, { BaseToast } from 'react-native-toast-message';

const Stack = createNativeStackNavigator();

const toastConfig = {
  // Toast提示自定义配置
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#A5D6A7', height: 40, width: '80%', backgroundColor: '#A5D6A7' ,marginTop:60}}
      contentContainerStyle={{ paddingHorizontal: 15 }} 
      text1Style={{
        fontSize: 16,
        fontWeight: '400', 
        textAlign: 'center' 
      }}
    />
  ),
  error: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#EF9A9A', height: 40, width: '80%', backgroundColor: '#EF9A9A' ,marginTop:60}}
      contentContainerStyle={{ paddingHorizontal: 15 }} 
      text1Style={{
        fontSize: 16,
        fontWeight: '400', 
        textAlign: 'center' 
      }}
    />
  ),
};

export default function App() {
  return (
    // 导航器配置
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="登录界面" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="注册界面" component={RegisterScreen} options={{ headerShown: false }} />
          <Stack.Screen name="主界面" component={MainScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Detail" component={DetailScreen} options={{
            headerTitle: '',
          }} />
          <Stack.Screen name="编辑游记" component={editTravelScreen}  />
          <Stack.Screen name="修改用户信息" component={EditUserInfoScreen} options={{
          headerTitleAlign:'center'
          }} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast config={toastConfig} />
    </PaperProvider>
  )
}
