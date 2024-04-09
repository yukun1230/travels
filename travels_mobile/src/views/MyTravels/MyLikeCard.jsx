import React, { useState } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Card, Title, Paragraph, Dialog, Portal, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { storeToken, getToken, removeToken } from '../../util/tokenRelated';
import axios from 'axios';
import { NGROK_URL } from '../../config/ngrok'
import { useSelector, useDispatch } from 'react-redux';
import { setUser, clearUser } from '../../redux/userSlice';


const MyLikeCard = ({ id, imageUrl, title, content, userAvatar, nickname, fetchTravels }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userInfo = useSelector(state => state.user);
  const [visible, setVisible] = useState(false);
  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const handleCancelCollect = async () => {
    try {
      const token = await getToken();
      const response = await axios.post(`${NGROK_URL}/travels/UndoCollectTravel`,
        { travelId: id },
        { headers: { 'token': token } }
      );
      if (response.data.message==='取消收藏成功') {
        dispatch(setUser({
          ...userInfo,
          collectTravels: userInfo.collectTravels.filter(item => item !== id),
      }));
      
    } else {
        console.log('取消收藏失败', response.data.message);
    };
      console.log(response.data);
      // 删除成功，调用传入的 fetchTravels 函数刷新列表
      fetchTravels();
      hideDialog();
    } catch (error) {
      console.error("删除失败:", error);
    }
  };


  return (
    <Card style={styles.card}>
      <Portal >
        {/* 删除对话框 */}
        <Dialog visible={visible} onDismiss={hideDialog} style={styles.dialogStyle}>
          <Dialog.Title style={styles.dialogTitleStyle}>取消收藏</Dialog.Title>
          <Dialog.Content style={styles.dialogContentStyle}>
            <Text style={{ fontSize: 16 }}>您确定不再收藏这篇游记吗？</Text>
          </Dialog.Content>
          <Dialog.Actions style={{ marginTop: -10,borderTopColor:'grey',borderTopWidth:0.5,flexDirection:'row',paddingBottom: 0,paddingHorizontal: 0,height:50}}>
            <View style={{flex:1,borderRightWidth:0.5,borderRightColor:'grey',height:50, justifyContent: 'center',alignItems: 'center',}}>
              <TouchableOpacity style={{width:150,height:50, justifyContent: 'center',alignItems: 'center'}} onPress={hideDialog}>
                <Text style={{ color: 'grey',fontSize:18 }}>取消</Text>
              </TouchableOpacity>
            </View>
            {/* <View></View> */}
            
            <TouchableOpacity style={{flex:1,height:50,justifyContent: 'center',
            alignItems: 'center',}} onPress={handleCancelCollect}>
              <Text style={{ color: '#d32f2f',fontSize:18 }}>确认</Text>
            </TouchableOpacity>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <View style={styles.topContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
        />
        <View style={styles.textContainer}>
          <Title
            numberOfLines={1}
            ellipsizeMode='tail'
            style={styles.title}
          >
            {title}
          </Title>
          <Paragraph
            numberOfLines={3}
            ellipsizeMode='tail'
            style={styles.paragraph}
          >
            {content}
          </Paragraph>
        </View>
      </View>
      <Card.Actions style={styles.bottomContainer}>
        <View style={styles.likeUser}>
          <Image
            source={{ uri: userAvatar }}
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
            }}
          />
          <Text style={{ marginLeft: 10 }}>{nickname}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={showDialog}>
            <Text style={styles.buttonText}>删除</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.editButton]} onPress={() => { navigation.navigate('Detail', { cardId: id }) }}>
            <Text style={{ color: 'rgb(81,178,127)' }} >详情</Text>
          </TouchableOpacity>
        </View>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    // marginBottom: 0,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  topContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
  },
  paragraph: {
    color: 'gray',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 6,
  },
  statusContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 150,
    width: 60,
    height: 30,
    borderRadius: 8,
    backgroundColor: "rgb(81,178,127)"
  },
  status: {
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: "white",
    width: 60,
    height: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#d32f2f",
  },
  buttonText: {
    color: '#d32f2f',
  },
  editButton: {
    borderColor: 'rgb(81,178,127)',
  },
  likeUser: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dialogStyle: {
    backgroundColor: 'white', // 修改对话框的背景色
    borderRadius: 10, // 设置边角圆滑度
    padding: 0, // 内部间距
  },
  dialogTitleStyle: {
    color: 'black', // 标题文字颜色
    // textAlign: 'center', // 标题居中
  },
  dialogContentStyle: {
    color: 'grey', // 内容文字颜色
    marginBottom: 10, // 内容与对话框底部的间距
  },
  
});

export default MyLikeCard;