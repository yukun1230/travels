import AsyncStorage from '@react-native-async-storage/async-storage';

// 设置token的值
const storeToken = async (value) => {
  try {
    await AsyncStorage.setItem('token', value);
  } catch (e) {
    return e
  }
};
// 获取token的值
const getToken = async () => {
  try {
    const value = await AsyncStorage.getItem('token');
    if (value !== null) {
      // value previously stored
      return value
    }
  } catch (e) {
    // error reading value
    return e
  }
};
// 删除token
const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('token');
  } catch (e) {
    // remove error
  }
};

export { storeToken, getToken, removeToken }