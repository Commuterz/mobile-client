import { StyleSheet, Platform,Dimensions } from 'react-native'
const { width: screenWidth, height: screenHiehgt } = Dimensions.get('window');

/* Styles ==================================================================== */
const styles = StyleSheet.create({
  topProfilePicView:{
    height: 120,
    width: screenWidth,
    backgroundColor:'#4595FA',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  profileButton:{
    height: 70,
    width: 70,
    top:30,
  },
  profilePlusIcon:{
    height: 10,
    width: 10,
    top:30,
    left:-5
  },
  textBorderView:{
    borderRadius:5,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderBottomWidth:2,
    borderColor : 'white',
    width: screenWidth-40,
    left: 20,
    right: 20,
    marginTop: 20,
  },
  signUpButton:{
    width: screenWidth-50,
    left: 25,
    right: 25,
    height:40,
    backgroundColor:'#5fdf71',
    justifyContent: 'center',
    alignItems:'center',
    marginTop: 10,
  },
  signUpButtonText:{
     fontFamily: 'Exo-Medium',
     fontSize: 20,
     fontWeight: 'bold',
     color: '#ffffff'
  },
  termsConditionView:{
    width: screenWidth-50,
    left: 25,
    right: 25,
    justifyContent: 'center',
    alignItems:'center',
    marginTop: 10,
    marginBottom: 20,
    backgroundColor:'transparent',
  },
  termsConditionText:{
     fontFamily: 'Exo-Light',
     fontSize: 16,
     fontWeight: 'normal',
     color: '#ffffff',
     backgroundColor:'transparent',
  },
  termsConditionButton:{
     fontFamily: 'Exo-Medium',
     fontSize: 16,
     fontWeight: 'normal',
     color: '#61a8fc',
     backgroundColor:'transparent',
  },
  input: {
    height: 50,
    width: screenWidth-60,
    top: 0,
    left:20
  }
});

export default styles;
