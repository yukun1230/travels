import * as React from 'react';
import 'react-native-gesture-handler';
import LoginScreen from './src/views/Login/login';
import MainScreen from './src/views/main';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from './src/views/Register/register'
import DetailScreen from './src/views/Detail'
import StorageScreen from './src/views/Storage'
import editTravelScreen from './src/views/EditTravel/editTravel'

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="登录界面" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="注册界面" component={RegisterScreen} options={{ headerTitle: '' }} />
          <Stack.Screen name="主界面" component={MainScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Detail" component={DetailScreen} options={{
            headerTitle: '',
            // 控制导航条与顶部的距离
            headerStyle: {
              height: 120, // 这里设置你希望的导航条高度
            },
          }} />
          <Stack.Screen name="本机仓库" component={StorageScreen}  />
          <Stack.Screen name="编辑游记" component={editTravelScreen}  />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  )
}
