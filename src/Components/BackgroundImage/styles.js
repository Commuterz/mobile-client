import { StyleSheet, Platform,Dimensions } from 'react-native'
const { width: screenWidth, height: screenHiehgt } = Dimensions.get('window');

/* Styles ==================================================================== */
const styles = StyleSheet.create({

  image_style: {
    height: screenHiehgt,
    width: screenWidth,
    flexGrow: 1,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    ...Platform.select({
      ios: {
        resizeMode: "stretch",
      },
      android: {
        resizeMode: "cover",
      },
    }),

  },
});

export default styles;
