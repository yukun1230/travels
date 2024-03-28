import { Text, View, TextInput, StyleSheet } from 'react-native';
import { THEME_BACKGROUND, THEME_LABEL, THEME_TEXT } from '../../assets/CSS/color';
import Button from 'apsl-react-native-button'


export default LoginScreen = ({ navigation }) => {
  const handlelogin = () => {
    // 跳转页面
    navigation.navigate("注册界面")
  }
  return (
    <View style={styles.loginPage}>
      <View style={styles.loginSection}>
        <Text style={styles.loginTitle}>用户登录</Text>
        <TextInput
          style={styles.loginInput}
          placeholder='请输入您的用户名'
          autoCapitalize={'none'}
          maxLength={11}
        />
        <TextInput
          style={styles.loginInput}
          placeholder='请输入您的密码'
          secureTextEntry={true}
          autoCapitalize={'none'}
          maxLength={20}
        />
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <Button style={styles.login_Button} textStyle={{ fontSize: 18, color: "white" }}>登录</Button>
          <Button style={styles.login_Button} textStyle={{ fontSize: 18, color: "white" }}>重置</Button>
        </View>
        <View style={styles.subButton}>
          <Text style={styles.subButtonText} onPress={handlelogin}>新用户注册</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  loginPage: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: THEME_BACKGROUND
  },
  loginSection: {
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 20
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: '500',
    color: THEME_LABEL,
    textAlign: 'center',
    marginTop: 32,
    marginBottom: 32
  },
  login_Button: {
    flex: 1,
    backgroundColor: '#2196F3',
    marginLeft: 10,
    marginRight: 10,
    height: 35,
    borderRadius: 10,
    borderColor: "#2196F3"
  },
  subButton: {
    marginTop: 8
  },
  subButtonText: {
    color: "#1500EF",
    fontSize: 14,
  },
  loginInput: {
    marginBottom: 10,
    borderBottomWidth: 2,
    height: 40,
    borderBottomColor: THEME_TEXT
  },
  message: {
    marginTop: 16,
    color: THEME_TEXT,
    fontSize: 14
  }
});