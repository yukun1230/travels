import React from 'react';
import { Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';


// const DetailScreen = ({ navigation, route }) => {
//   // 使用传递过来的cardId
//   const { cardId } = route.params;
const DetailScreen = ({ navigation }) => {
  // useFocusEffect是React Navigation提供的一个Hook。它的作用是当屏幕获得或失去焦点时执行一些操作。
  useFocusEffect(
    // useCallback确保只有当navigation对象变化时，传递给useFocusEffect的函数才会改变。
    React.useCallback(() => {
      // 当进入详情页时隐藏底部导航
      const parent = navigation.getParent(); //父导航器tabBar
      parent.setOptions({ tabBarStyle: { display: 'none' } });

      // 当离开详情页时恢复底部导航
      return () => parent.setOptions({ tabBarStyle: undefined });
    }, [navigation])
  );

  return (
    <View>
      <Text>这是详情页</Text>
    </View>
  );
};

export default DetailScreen;