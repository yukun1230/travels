import React from 'react';
import { View, Modal, ActivityIndicator, StyleSheet } from 'react-native';

const LoadingOverlay = ({ isVisible }) => {
  return (
    // <Modal transparent={true} visible={isVisible} animationType="none">
    //   <View style={styles.centeredView}>
    //     <View style={styles.overlay}>
    //       <ActivityIndicator size={60} color="#007BFF" />
    //     </View>
    //   </View>
    // </Modal>
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="none"
      onRequestClose={() => {}} // 这是Android必须处理的props，即使不用它
    >
      {/* 全屏透明蒙层，阻止与下层视图的交互 */}
      <View style={styles.fullScreenOverlay}>
        <View style={styles.overlay}>
          <ActivityIndicator size={60} color="#007BFF" />
        </View>
      </View>
    </Modal>
  );
};

// const styles = StyleSheet.create({
//   centeredView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
  // overlay: {
  //   width: 150, // 控制白色背景区域的大小
  //   height: 150,
  //   backgroundColor: 'white',
  //   borderRadius: 10,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   elevation: 5, 
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.25,
  //   shadowRadius: 3.84,
  // },
// });
const styles = StyleSheet.create({
  fullScreenOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0)', // 透明
  },
  overlay: {
    width: 150, // 控制白色背景区域的大小
    height: 150,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default LoadingOverlay;