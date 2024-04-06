import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';



const MyLikeCard = ({ id, imageUrl, title, content, userAvatar, userName }) => {
  const navigation = useNavigation();
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
        <View style={styles.likeUser}>
          <Image
            source={{ uri: userAvatar }}
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
            }}
          />
          <Text style={{ marginLeft: 10 }}>{userName}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate('本机仓库') }}>
            <Text style={styles.buttonText}>删除</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.editButton]} onPress={() => { navigation.navigate('Detail', { id }) }}>
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
  
});

export default MyLikeCard;