import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Dialog, Portal } from 'react-native-paper';


// 封装对话框组件
const MyDialog = ({ visible, onDismiss, titleText, dialogText, cancelText, confirmText, handleCancel, handleConfirm }) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialogStyle}>
        <Dialog.Title style={styles.dialogTitleStyle}>{titleText}</Dialog.Title>
        <Dialog.Content style={styles.dialogContentStyle}>
          <Text style={{ fontSize: 16 }}>{dialogText}</Text>
        </Dialog.Content>
        <Dialog.Actions style={{ marginTop: -10, borderTopColor: '#D3D3D3', borderTopWidth: 1, flexDirection: 'row', paddingBottom: 0, paddingHorizontal: 0, height: 50 }}>
          <View style={{ flex: 1, borderRightWidth: 1, borderRightColor: '#D3D3D3', height: 50, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity style={{ width: 150, height: 50, justifyContent: 'center', alignItems: 'center' }} onPress={handleCancel}>
              <Text style={{ color: 'grey', fontSize: 18 }}>{cancelText}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={{ flex: 1, height: 50, justifyContent: 'center', alignItems: 'center' }} onPress={handleConfirm}>
            <Text style={{ color: '#d32f2f', fontSize: 18 }}>{confirmText}</Text>
          </TouchableOpacity>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

// 样式表
const styles = StyleSheet.create({
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
  }
});


// 默认props
MyDialog.defaultProps = {
  cancelText: '取消',
  confirmText: '确认',
  dialogText: '您确定要取消吗？'
};

export default MyDialog;