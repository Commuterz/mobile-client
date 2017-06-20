import { StyleSheet, Platform,Dimensions } from 'react-native'
const { width: screenWidth, height: screenHiehgt } = Dimensions.get('window');

/* Styles ==================================================================== */
const styles = StyleSheet.create({

  container: {
    height: screenHiehgt-70,
    width: screenWidth,
    left: 0,
    right: 0,
    top: 70,
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
  congratulations_text:{
     fontFamily: 'Exo-Bold',
     fontSize: 30,
     fontWeight: '600',
     color: '#ffffff',
     backgroundColor:'transparent',
     textAlign :'center',
     marginTop : 10,
  },
  user_image: {
    height: 40,
    width: 40,
    marginTop:10
  },
  user_name_text:{
     fontFamily: 'Exo-Bold',
     fontSize: 22,
     fontWeight: 'bold',
     color: '#ffffff',
     backgroundColor:'transparent',
     textAlign :'center',
     marginLeft:5,
  },
  price_text:{
     fontFamily: 'Exo-DemiBold',
     fontSize: 16,
     fontWeight: '600',
     color: '#ffffff',
     backgroundColor:'transparent',
     textAlign :'center',
     marginTop:5,
  },
  anounce_text:{
     fontFamily: 'Exo-Light',
     fontSize: 14,
     fontWeight: 'normal',
     color: '#ffffff',
     backgroundColor:'transparent',
     textAlign :'center',
     marginTop:5,
  },
  current_price_view: {
    height: 92,
    width: 238,
    marginTop:20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coin_bg: {
    height: 92,
    width: 238,
    top:0,
    bottom:0,
    position:'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  current_price_text:{
     fontFamily: 'Exo-DemiBold',
     fontSize: 18,
     fontWeight: 'bold',
     color: '#ffffff',
     backgroundColor:'transparent',
     textAlign :'center',
  },
  coin_view: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop : 10
  },
  coin_text:{
     fontFamily: 'Exo-Bold',
     fontSize: 35,
     fontWeight: 'bold',
     color: '#fcea61',
     backgroundColor:'transparent',
     textAlign :'center',
     marginLeft:10,
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
