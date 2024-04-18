import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import AvatarMenu from './AvatarMenu';

// 顶部组件;包括头像菜单,搜索框
const Header = ({ searchText, setSearchText, handleSearch }) => {
  return (
    <View style={styles.aboveAll}>
      <View style={styles.avatarMenu}>
        {/* 头像菜单 */}
        <AvatarMenu></AvatarMenu>
      </View>
      <View style={styles.searchBar}>
        {/* 搜索框 */}
        <TextInput
          style={styles.textInput}
          placeholder="请输入您要搜索的内容"
          onChangeText={searchText => setSearchText(searchText)}
          defaultValue={searchText}
        />
      </View >
      <View style={styles.buttonContainer}>
        <Button
          style={styles.button}
          labelStyle={styles.buttonText}
          onPress={handleSearch}
        >搜索</Button>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  aboveAll: {
    flexDirection: "row",
    marginRight: 16,
    marginTop: 16,
    height: 45
  },
  avatarMenu: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  searchBar: {
    flex: 3
  },
  textInput: {
    height: 35,
    width: 260,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 20,
    borderColor: "#2196F3",
    fontSize: 14
  },
  buttonContainer: {
    flex: 1
  },
  button: {
    backgroundColor: '#2196F3',
    height: 35,
    borderRadius: 20,
    borderColor: "#2196F3"
  },
  buttonText: {
    fontSize: 18,
    color: "white"
  }
});

export default Header;