import React, { useState } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Card, Title, Paragraph, Dialog, Portal, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { storeToken, getToken, removeToken } from '../../util/tokenRelated';
import axios from 'axios';
import { NGROK_URL } from '../../config/ngrok'
import { AntDesign } from '@expo/vector-icons';

// 现在组件接收一个额外的 id 参数
const MyTravelCard = ({ id, photo, title, content, status, location, rejectedReason, fetchTravels }) => {
  const navigation = useNavigation();
  let statusInfo = '';
  if (status === 1) {
    statusInfo = '已通过';
  } else if (status === 0) {
    statusInfo = '未通过';
  } else if (status === 2) {
    statusInfo = '待审核';
  }

  const CardData = {
    id: id,
    photo: photo,
    title: title,
    content: content,
    location: location

  }

  // const handleDelete = async () => {
  //   const token = await getToken();
  //   console.log(id);
  //   axios.post(`${NGROK_URL}/travels/deleteOneTravel`, {
  //     headers: { 'token': token },
  //     data: {
  //       id: id
  //     }
  //   }).then(res => {
  //     console.log(res.data);
  //     // navigation.navigate('我的游记');
  //   }).catch(err => {
  //     console.log(err);
  //   })
  // }

  //  const handleDelete = async () => {
  //   try {
  //     const token = await getToken();
  //     await axios.post(`${NGROK_URL}/travels/deleteOneTravel`, { id }, { headers: { 'token': token } });
  //     // 删除成功后，调用 fetchTravels 来刷新列表
  //     fetchTravels();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const [visible, setVisible] = useState(false);
  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);


  const [rejectVisible, setRejectVisible] = useState(false);
  const showReject = () => setRejectVisible(true);

  const hideReject = () => setRejectVisible(false);


  const handleDelete = async () => {
    try {
      const token = await getToken();
      const response = await axios.post(`${NGROK_URL}/travels/deleteOneTravel`,
        { id: id },
        { headers: { 'token': token } }
      );
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
          <Dialog.Title style={styles.dialogTitleStyle}>删除确认</Dialog.Title>
          <Dialog.Content style={styles.dialogContentStyle}>
            <Text style={{ fontSize: 16 }}>您确定要删除这篇游记吗？</Text>
          </Dialog.Content>
          <Dialog.Actions style={{ marginTop: -10,borderTopColor:'grey',borderTopWidth:0.5,flexDirection:'row',paddingBottom: 0,paddingHorizontal: 0,height:50}}>
            <View style={{flex:1,borderRightWidth:0.5,borderRightColor:'grey',height:50, justifyContent: 'center',alignItems: 'center',}}>
              <TouchableOpacity style={{width:150,height:50, justifyContent: 'center',alignItems: 'center'}} onPress={hideDialog}>
                <Text style={{ color: 'grey',fontSize:18 }}>取消</Text>
              </TouchableOpacity>
            </View>
            {/* <View></View> */}
            
            <TouchableOpacity style={{flex:1,height:50,justifyContent: 'center',
            alignItems: 'center',}} onPress={handleDelete}>
              <Text style={{ color: '#d32f2f',fontSize:18 }}>确认</Text>
            </TouchableOpacity>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Portal >
        {/* 删除对话框 */}
        <Dialog visible={rejectVisible} onDismiss={hideReject} style={styles.dialogStyle}>
          <Dialog.Title style={styles.dialogTitleStyle}>未通过审核</Dialog.Title>
          <Dialog.Content style={styles.dialogContentStyle}>
            <Text style={{ fontSize: 16 }}>原因: {rejectedReason}</Text>
          </Dialog.Content>
          <Dialog.Actions style={{ marginTop: -10,borderTopColor:'grey',borderTopWidth:0.5,flexDirection:'row',paddingBottom: 0,paddingHorizontal: 0,height:50}}>
            <View style={{flex:1,borderRightWidth:0.5,borderRightColor:'grey',height:50, justifyContent: 'center',alignItems: 'center',}}>
              <TouchableOpacity style={{width:150,height:50, justifyContent: 'center',alignItems: 'center'}} onPress={hideReject}>
                <Text style={{ color: 'grey',fontSize:18 }}>取消</Text>
              </TouchableOpacity>
            </View>
            {/* <View></View> */}
            
            <TouchableOpacity style={{flex:1,height:50,justifyContent: 'center',
            alignItems: 'center',}} onPress={() => { navigation.navigate('编辑游记', { ...CardData });hideReject(); }}>
              <Text style={{ color: '#007BFF' ,fontSize:18 }}>重新编辑</Text>
            </TouchableOpacity>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <View style={styles.topContainer}>
        <Image
          source={{ uri: photo[0].uri }}
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
        {status === 1 && <View style={[styles.statusContainer, { backgroundColor: "rgb(81,178,127)" }]}>
          <Text style={styles.status}>{statusInfo}</Text>
        </View>}
        {status === 0 && 
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
          <View style={{justifyContent: 'center', alignItems: 'center', marginRight: 20,width: 60,height: 30,borderRadius: 8, backgroundColor: "#d32f2f" }}>
            <Text style={styles.status}>{statusInfo}</Text>
            {/* <Text>{rejectedReason}</Text> */}
          </View>
          
          <TouchableOpacity style={{marginRight:105}} onPress={showReject}>
              <AntDesign name="warning" size={24} color="red" />
          </TouchableOpacity>

        </View>   }
        {status === 2 && <View style={[styles.statusContainer, { backgroundColor: "rgb(255, 204, 0)" }]}>
          <Text style={styles.status}>{statusInfo}</Text>
        </View>}


        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={showDialog}>
            <Text style={styles.buttonText}>删除</Text>
          </TouchableOpacity>
          {status === 1 ?
            <TouchableOpacity style={[styles.button, { borderColor: 'rgb(81,178,127)' }]} onPress={() => { navigation.navigate('Detail', { cardId: id }) }}>
              <Text style={{ color: 'rgb(81,178,127)' }}>详情</Text>
            </TouchableOpacity> :
            <TouchableOpacity style={[styles.button, styles.editButton]}
              onPress={() => { navigation.navigate('编辑游记', { ...CardData }) }}>
              <Text style={{ color: '#007BFF' }}>编辑</Text>
            </TouchableOpacity>}

        </View>
      </Card.Actions>
    </Card>
  );
};

// 保留你的样式定义
const styles = StyleSheet.create({
  card: {
    margin: 10,
    // marginBottom:5,
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
    borderColor: '#007BFF',
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

export default MyTravelCard;