<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
  <Input
    style={{ flex: 1 }}
    value={value}
    onChangeText={(text) => {
      setPasswordValue(text);
      onChange(text);
    }}
    placeholder="8到16位(大小写字母和数字)"
    secureTextEntry={!showPassword}
  />
  <TouchableWithoutFeedback style={{ marginRight: 10, flex: 1 }} onPress={onShowPassword}>
    {
      showPassword ?
        <Image source={require('../../../assets/show.png')} style={{ width: 39, height: 26, alignSelf: 'center' }} /> :
        <Image source={require('../../../assets/unshow.png')} style={{ width: 39, height: 26, alignSelf: 'center' }} />
    }
  </TouchableWithoutFeedback>
</View>