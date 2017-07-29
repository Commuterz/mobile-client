import { StyleSheet, Platform,Dimensions } from 'react-native'
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

/* Styles ==================================================================== */
const styles = StyleSheet.create({

  container: {
    height: screenHeight,
    width: screenWidth,
    left: 0,
    right: 0,
    top: '9%',
    bottom: 0,
    position:'absolute'
  },
  bg_image: {
    height: screenHeight,
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
    height: '60%',
    width: screenWidth-40,
    left: 20,
    right: 20,
    top:'12%',
    position:'absolute',
    alignItems: 'center',
  },
  popup_bg: {
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
     color: '#ffffff',
     textAlign :'center',
     marginTop : 15,
     backgroundColor:'transparent'
  },
  user_view: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:10,
  },
  avatarWrapper: {
    height: 40,
    width: 40,
    borderRadius: 23,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight:5
  },
  imageAvatar: {
    width: 40,
    height: 40,
    borderRadius: 23,
    marginLeft:1
  },

  user_name_text:{
     fontFamily: 'Exo-Medium',
     fontSize: 23,
     color: '#ffffff',
     fontStyle :'italic',
     textAlign :'center',
     marginLeft:5,
     backgroundColor:'transparent',
  },
  price_text:{
     fontFamily: 'Exo-Bold',
     fontSize: 23,
     color: '#ffffff',
     textAlign :'center',
     marginTop:15,
     backgroundColor:'transparent',
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
     color: '#ffffff',
     backgroundColor:'transparent',
     textAlign :'center',
  },
});

export default styles;
