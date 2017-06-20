import { StyleSheet, Platform,Dimensions } from 'react-native'
const { width: screenWidth, height: screenHiehgt } = Dimensions.get('window');

/* Styles ==================================================================== */
const styles = StyleSheet.create({

  container: {
    height: screenHiehgt-80,
    width: screenWidth,
    left: 0,
    right: 0,
    top: 50,
    bottom: 0,
    position:'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bg_image: {
    height: screenHiehgt-70,
    width: screenWidth,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position:'absolute'
  },
  popup_bg_view: {
    height: 306,
    width: screenWidth-40,
    left: 20,
    right: 20,
    top:70,
    position:'absolute',
    alignItems: 'center',
  },
  popup_bg_sub_view1: {
    height: 187,
    width: screenWidth-40,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor:'#4595fa',
  },
  popup_bg_sub_view2: {
    height: 119,
    width: screenWidth-40,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor:'#ffffff',
  },
  congratulations_text:{
     fontFamily: 'Exo-Bold',
     fontSize: 35,
     fontWeight: 'bold',
     color: '#ffffff',
     backgroundColor:'transparent',
     textAlign :'center',
     marginTop : 10,
  },
  user_bg_view: {
    alignItems: 'center',
    flexDirection:'row'
  },
  user_image: {
    height: 60,
    width: 60,
  },
  user_address_view: {
    justifyContent: 'center',
  },
  user_name_text:{
     fontFamily: 'Exo-Bold',
     fontSize: 18,
     fontWeight: 'bold',
     color: '#ffffff',
     backgroundColor:'transparent',
     textAlign :'left',
     marginLeft:5,
  },
  user_address_text:{
     fontFamily: 'Exo-Medium',
     fontSize: 16,
     fontWeight: '500',
     color: '#ffffff',
     backgroundColor:'transparent',
     textAlign :'left',
     marginLeft:5,
  },
  pickup_text:{
     fontFamily: 'Exo-Medium',
     fontSize: 30,
     fontWeight: '500',
     color: '#ffffff',
     backgroundColor:'transparent',
     textAlign :'left',
     marginLeft:5,
  },
  call_view: {
    height: 44,
    width: 200,
    marginTop:30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#5fdf71',
  },
  call_text:{
     fontFamily: 'Exo-Medium',
     fontSize: 18,
     fontWeight: '500',
     color: '#ffffff',
     backgroundColor:'transparent',
     textAlign :'center',
  },
  close_View: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop : 10
  },
  close_text:{
     fontFamily: 'Exo-Medium',
     fontSize: 18,
     fontWeight: '500',
     color: '#ffffff',
     backgroundColor:'transparent',
     textAlign :'center',
  },
});

export default styles;
