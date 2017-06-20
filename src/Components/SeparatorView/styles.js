import { StyleSheet, Platform,Dimensions } from 'react-native'
const { width: screenWidth, height: screenHiehgt } = Dimensions.get('window');

/* Styles ==================================================================== */
const styles = StyleSheet.create({
  seperator: {
    height: 2,
    width: screenWidth-42,
    top: 49,
    left:0,
    backgroundColor:'white',
  }
});

export default styles;
