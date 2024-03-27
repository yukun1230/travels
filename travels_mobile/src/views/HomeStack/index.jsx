import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../Home/home';
import DetailScreen from '../Detail'; 

const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Detail" component={DetailScreen} options={{
        headerTitle: '',
        // 控制导航条与顶部的距离
        headerStyle: {
          height: 100, // 这里设置你希望的导航条高度
        },
        
      }} />
    </Stack.Navigator>
  );
}

export default HomeStack;