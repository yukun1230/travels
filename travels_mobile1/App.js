import * as React from 'react';
import { Text, View } from 'react-native';
import HomeScreen from './component/Home/home';
import MyTravelsScreen from './component/MyTravels/myTravels';
import AddTravelsScreen from './component/AddTravels/addTravels';
import { NavigationContainer } from '@react-navigation/native';
import { store } from './redux/store';
import { Provider } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';


const Tab = createBottomTabNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === '首页') {
              iconName = focused
                ? 'information-circle'
                : 'information-circle-outline';
            } else if (route.name === '游记发布') {
              iconName = focused ? 'list' : 'list-outline';
            } else if (route.name === '我的游记') {
              iconName = focused ? 'person' : 'person-outline';
            }
            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'blue',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="首页" component={HomeScreen} />
        <Tab.Screen name="游记发布" component={AddTravelsScreen} />
        <Tab.Screen name="我的游记" component={MyTravelsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}