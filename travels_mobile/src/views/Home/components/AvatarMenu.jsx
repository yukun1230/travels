import React, { useState } from 'react';
import { Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Menu, Divider } from 'react-native-paper'; // Assuming you're using react-native-paper
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { clearUser } from '../../../redux/userSlice';
import { removeToken } from '../../../util/tokenRelated'

const AvatarMenu = () => {
  // 顶部头像菜单组件
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false); //控制头像下拉菜单显隐
  const dispatch = useDispatch();
  const userInfo = useSelector(state => state.user);  //redux获取用户数据
  const onLogout = () => {
    // 退出登录函数
    removeToken();
    dispatch(clearUser());
    navigation.navigate("登录界面");
  };

  // 控制下拉菜单显隐
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);


  return (
    <Menu
      // 下拉菜单组件
      visible={visible}
      onDismiss={closeMenu}
      anchor={
        // 挂载在头像上
        <TouchableOpacity onPress={openMenu}>
          <Image
            source={userInfo.avatar ? { uri: userInfo.avatar } : { uri: "https://5b0988e595225.cdn.sohucs.com/images/20171114/bc48840fb6904dd4bd8f6a8af8178af4.png" }}
            style={{ width: 36, height: 36, borderRadius: 18 }}
          />
        </TouchableOpacity>
      }
      anchorPosition={'bottom'}
      contentStyle={{ marginTop: -50, marginLeft: 3, backgroundColor: '#fff', width: 140 }}
    >
      {/* 菜单项 */}
      {userInfo.id ? (
        <>
          <Menu.Item title="写游记" leadingIcon="square-edit-outline" onPress={() => { navigation.navigate('游记发布'); closeMenu(); }} />
          <Divider />
          <Menu.Item title="我的游记" leadingIcon="account" onPress={() => { navigation.navigate('我的游记'); closeMenu(); }} />
          <Divider />
          <Menu.Item title="退出登录" leadingIcon="logout" onPress={onLogout} />
        </>
      ) : (
        <Menu.Item title="登录" leadingIcon="login" onPress={() => navigation.navigate("登录界面")} />
      )}
    </Menu>
  );
};



export default AvatarMenu;