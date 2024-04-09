import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
// 显示本机存储的键值对，仅供测试用


const StorageScreen = () => {
  const [storageItems, setStorageItems] = useState(null);

  const userInfo = useSelector(state => state.user);


  const getAllKeys = async () => {
    let keys = [];
    try {
      keys = await AsyncStorage.getAllKeys();
      if (keys != null) {
        getAllData(keys);
      }
    } catch (e) {
      // read key error
    }
  };

  const getAllData = async (keys) => {
    let items = [];
    try {
      const stores = await AsyncStorage.multiGet(keys);
      stores.map((result, i, store) => {
        let key = store[i][0];
        let value = store[i][1];
        items.push({ key, value });
      });
      setStorageItems(items);
    } catch (e) {
      // read error
    }
  };

  useEffect(() => {
    getAllKeys();
  }, []);

  return (
    <View>
      {storageItems &&
        storageItems.map((item) => {
          return (
            <View key={item.key}>
              <Text>Key: {item.key}</Text>
              <Text>Value: {item.value}</Text>
            </View>
          );
        })}
      <Button title="Refresh Storage" onPress={getAllKeys} />
      <View style={{ marginTop: 20 }}>
        <Text>Redux Store Data:</Text>
        <Text>ID: {userInfo.id}</Text>
        <Text>Nickname: {userInfo.nickname}</Text>
        <Text>Avatar: {userInfo.avatar}</Text>
        <Text>collectTravels: {userInfo.collectTravels}</Text>
        <Text>likeTravels: {userInfo.likeTravels}</Text>
      </View>
    </View>
  );
};

export default StorageScreen;