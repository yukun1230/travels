import { Card } from 'react-native-paper';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const UnLoginScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.aboveAll}>
      <Card style={styles.card}>
        <Text style={styles.title}>您还没登录</Text>
        <Text style={styles.subtitle}>请先登录或注册再进行此操作</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate('登录界面') }}>
            <Text style={styles.buttonText}>立即登录</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => { navigation.navigate('注册界面') }}>
          <Text style={styles.underButton}>还未注册?</Text>
        </TouchableOpacity>
      </Card>
    </View>
  )
}

const styles = StyleSheet.create({
  aboveAll: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 180
  },
  card: {
    shadowRadius: 10, // 设置阴影模糊半径
    backgroundColor: 'white',
    flexDirection: 'column',
    justifyContent: 'center',
    borderRadius: 10,
    height: 300,
    width: 300
  },
  title: {
    textAlign: 'center',
    fontSize: 25,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#B1B1B1'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20
  },
  button: {
    backgroundColor: "white",
    width: 250,
    height: 45,
    borderRadius: 20,
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18
  },
  underButton: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 18,
    color: '#2196F3'
  },
});


export default UnLoginScreen;