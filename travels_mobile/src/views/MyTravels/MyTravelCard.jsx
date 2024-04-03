import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

// 现在组件接收一个额外的 id 参数
const MyTravelCard = ({ id, imageUrl, title, content, status }) => {
  const navigation = useNavigation();
  let statusInfo = '';
  if (status === 1) {
    statusInfo = '已通过';
  }else if (status === 0) {
    statusInfo = '未通过';
  }else if (status === 2) {
    statusInfo = '待审核';
  }
  return (
    <Card style={styles.card}>
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
        {status === 1 && <View style={[styles.statusContainer, { backgroundColor: "rgb(81,178,127)" }]}>
          <Text style={styles.status}>{statusInfo}</Text>
        </View>}
        {status === 0 && <View style={[styles.statusContainer, { backgroundColor: "#d32f2f" }]}>
          <Text style={styles.status}>{statusInfo}</Text>
        </View>}
        {status === 2 && <View style={[styles.statusContainer, { backgroundColor: "rgb(255, 204, 0)" }]}>
          <Text style={styles.status}>{statusInfo}</Text>
        </View>}


        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => { }}>
            <Text style={styles.buttonText}>删除</Text>
          </TouchableOpacity>
          {status === 1 ? 
            <TouchableOpacity style={[styles.button, { borderColor: 'rgb(81,178,127)' }]} onPress={() => { navigation.navigate('Detail') }}>
              <Text style={{ color: 'rgb(81,178,127)' }}>详情</Text>
          </TouchableOpacity> : 
          <TouchableOpacity style={[styles.button, styles.editButton]} onPress={() => { }}>
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
  }
});

export default MyTravelCard;