import * as React from 'react';
import HomeScreen from './src/views/Home/home';
import MyTravelsScreen from './src/views/MyTravels/myTravels';
import AddTravelsScreen from './src/views/AddTravels/addTravels';
import { NavigationContainer } from '@react-navigation/native';
// import { store } from './src/redux/store';
// import { Provider } from 'react-redux';
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
              iconName = focused ? 'information-circle' : 'information-circle-outline';
            } else if (route.name === '游记发布') {
              iconName = focused ? 'add' : 'add-outline';
            } else if (route.name === '我的游记') {
              iconName = focused ? 'person' : 'person-outline';
            }
            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'blue',
          tabBarInactiveTintColor: 'black',
          tabBarHideOnKeyboard: 'ture'
        })}
      >
        <Tab.Screen name="首页" component={HomeScreen} />
        <Tab.Screen name="游记发布" component={AddTravelsScreen} />
        <Tab.Screen name="我的游记" component={MyTravelsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}