import { StyleSheet, Platform,Dimensions } from 'react-native'
const { width: screenWidth, height: screenHiehgt } = Dimensions.get('window');

/* Styles ==================================================================== */
const styles = StyleSheet.create({

  container: {
    height: screenHiehgt-80,
    width: screenWidth,
    left: 0,
    right: 0,
    top: 80,
    bottom: 0,
    position:'absolute'
  },
  bg_image: {
    height: screenHiehgt-80,
    width: screenWidth,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position:'absolute'
  },
  bg_coin: {
    height: 200,
    width: screenWidth,
    left: 0,
    right: 0,
    top:100,
    position:'absolute'
  },
  popup_bg_view: {
    height: 340,
    width: screenWidth-40,
    left: 20,
    right: 20,
    top:70,
    position:'absolute',
    alignItems: 'center',
  },
  popup_bg: {
    height: 340,
    width: screenWidth-40,
    left: 0,
    right: 0,
    top:0,
    bottom:0,
    position:'absolute',
  },
  hurry_text:{
     fontFamily: 'Exo-Bold',
     fontSize: 38,
     fontWeight: 'bold',
     color: '#ffffff',
     backgroundColor:'transparent',
     textAlign :'center',
     marginTop : 10,
  },
  user_view: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  user_image: {
    height: 40,
    width: 40,
  },
  user_name_text:{
     fontFamily: 'Exo-Bold',
     fontSize: 23,
     fontWeight: 'bold',
     color: '#ffffff',
     backgroundColor:'transparent',
     textAlign :'center',
     marginLeft:5,
  },
  price_text:{
     fontFamily: 'Exo-Bold',
     fontSize: 23,
     fontWeight: 'bold',
     color: '#ffffff',
     backgroundColor:'transparent',
     textAlign :'center',
     marginTop:5,
  },
  coin_bg_view: {
    height: 78,
    width: screenWidth-40,
    left: 0,
    right: 0,
    marginTop:20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coin_bg: {
    height: 78,
    width: screenWidth-40,
    left: 0,
    right: 0,
    top:0,
    bottom:0,
    position:'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coin_view: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coin_text:{
     fontFamily: 'Exo-Bold',
     fontSize: 52,
     fontWeight: 'bold',
     color: '#fcea61',
     backgroundColor:'transparent',
     textAlign :'center',
     marginLeft:10,
  },
  collect_view: {
    height: 44,
    width: 250,
    marginTop:30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#5fdf71',
  },
  collect_text:{
     fontFamily: 'Exo-Medium',
     fontSize: 22,
     fontWeight: '500',
     color: '#ffffff',
     backgroundColor:'transparent',
     textAlign :'center',
  },
});

export default styles;
