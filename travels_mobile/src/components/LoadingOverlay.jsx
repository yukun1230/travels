import React from 'react';
import { View, Modal, ActivityIndicator, StyleSheet, Text } from 'react-native';

const LoadingOverlay = ({ isVisible }) => {
  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="none"
      onRequestClose={() => {}} // 这是Android必须处理的props，即使不用它
    >
      {/* 全屏透明蒙层，阻止与下层视图的交互 */}
      <View style={styles.fullScreenOverlay}>
        <View style={styles.overlay}>
          <ActivityIndicator size={60} color="white" />
          <Text style={{fontSize:16,color:'white'}}>加载中...</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fullScreenOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0)', // 透明
  },
  overlay: {
    flexDirection:'column',
    width: 150, // 控制白色背景区域的大小
    height: 150,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingOverlay;