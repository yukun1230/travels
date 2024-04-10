import React, { useState } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Dialog, Portal } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { getToken } from '../../util/tokenRelated';
import axios from 'axios';
import { NGROK_URL } from '../../config/ngrok'
import { AntDesign } from '@expo/vector-icons';

const MyTravelCard = ({ id, photo, title, content, status, location, rejectedReason, fetchTravels }) => {
  const navigation = useNavigation();
  // 状态信息匹配
  let statusInfo = '';
  if (status === 1) {
    statusInfo = '已通过';
  } else if (status === 0) {
    statusInfo = '未通过';
  } else if (status === 2) {
    statusInfo = '待审核';
  }
  // 卡片数据
  const CardData = {
    id: id,
    photo: photo,
    title: title,
    content: content,
    location: location
  }

  // 删除对话框显隐控制
  const [visible, setVisible] = useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  // 审核未通过对话框显隐控制
  const [rejectVisible, setRejectVisible] = useState(false);
  const showReject = () => setRejectVisible(true);
  const hideReject = () => setRejectVisible(false);

  const handleDelete = async () => {
    // 删除游记功能
    try {
      const token = await getToken();
      const response = await axios.post(`${NGROK_URL}/travels/deleteOneTravel`,
        { id: id },
        { headers: { 'token': token } }
      );
<<<<<<< HEAD
      // console.log(response.data);
      // 删除成功，调用传入的 fetchTravels 函数刷新列表
=======
      // 调用fetchTravels()刷新页面
>>>>>>> 6a2c5296ae7702e59a92088c54100c28ee2ef673
      fetchTravels();
      // 隐藏对话框
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
            <TouchableOpacity style={{flex:1,height:50,justifyContent: 'center',
            alignItems: 'center',}} onPress={handleDelete}>
              <Text style={{ color: '#d32f2f',fontSize:18 }}>确认</Text>
            </TouchableOpacity>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Portal >
        {/* 审核未通过对话框*/}
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
            //超出行数的内容自动缩略 
            numberOfLines={1}
            ellipsizeMode='tail'
            style={styles.title}
          >
            {title}
          </Title>
          <Paragraph
            //超出行数的内容自动缩略 
            numberOfLines={3}
            ellipsizeMode='tail'
            style={styles.paragraph}
          >
            {content}
          </Paragraph>
        </View>
      </View>
      <Card.Actions style={styles.bottomContainer}>
        {/* 审核状态显示 */}
        {status === 1 && <View style={[styles.statusContainer, { backgroundColor: "rgb(81,178,127)" }]}>
          <Text style={styles.status}>{statusInfo}</Text>
        </View>}
        {status === 0 && 
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
          <View style={{justifyContent: 'center', alignItems: 'center', marginRight: 20,width: 60,height: 30,borderRadius: 8, backgroundColor: "#d32f2f" }}>
            <Text style={styles.status}>{statusInfo}</Text>
          </View>
          {/* 点击警示符号弹出未通过原因对话框 */}
          <TouchableOpacity style={{marginRight:105}} onPress={showReject}>
              <AntDesign name="warning" size={24} color="red" />
          </TouchableOpacity>
        </View>   }
        {status === 2 && <View style={[styles.statusContainer, { backgroundColor: "rgb(255, 204, 0)" }]}>
          <Text style={styles.status}>{statusInfo}</Text>
        </View>}

        <View style={styles.buttonContainer}>
          {/* 按钮栏 */}
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


// 样式表
const styles = StyleSheet.create({
  card: {
    margin: 10,
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
    backgroundColor: 'white', 
    borderRadius: 10, 
    padding: 0, 
  },
  dialogTitleStyle: {
    color: 'black', 
  },
  dialogContentStyle: {
    color: 'grey', 
    marginBottom: 10, 
  },
});
export default MyTravelCard;