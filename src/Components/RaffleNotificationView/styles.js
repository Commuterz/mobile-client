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
  backgroundColor:'red',
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
bg_pool_coin: {
  height: 200,
  width: screenWidth,
  left: 0,
  right: 0,
  top:100,
  position:'absolute'
},

timer_view: {
  height: 100,
  width: '90%',
  left: 20,
  right: 20,
  marginTop: 20,
  backgroundColor:'black',
  borderRadius:5,
},
time_remained_text:{
   fontFamily: 'Exo-DemiBold',
   fontSize: 22,
   color: '#fcea61',
   backgroundColor:'transparent',
   textAlign :'center',
   marginTop: 5,
},
pool_size_view: {
  height: 95,
  width: '70%',
  marginLeft:50,
  marginRight:50,
  marginTop: 20,
  backgroundColor:'black',
  borderRadius:10,
},
fieldNameContainer: {
  flex: 1,
  alignSelf: 'stretch',
  flexDirection: 'row',
  backgroundColor: '#000',
  borderRadius: 5,
  justifyContent: 'center',
  alignItems: 'center',
},
timeFieldContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: -10,
},
textTimeValue: {
  fontFamily: 'Exo-Bold',
  fontSize: 35,
  color: '#fff',
  height: 40,
},
textDotValue: {
  fontFamily: 'Exo-Bold',
  fontSize: 35,
  color: '#929497',
  height: 40,
},
textTimeLabel: {
  fontFamily: 'Exo-Medium',
  fontSize: 12,
  color: '#929497',
  marginTop: 5,
},
current_pull_size_text:{
   fontFamily: 'Exo-DemiBold',
   fontSize: 18,
   color: '#ffffff',
   backgroundColor:'transparent',
   textAlign :'center',
   marginTop: 5,
},
pull_size_container:{
 backgroundColor:'transparent',
 flexDirection: 'row',
 justifyContent: 'center',
 alignItems: 'center',
 marginTop: -5,
},
pull_size_value_text:{
 fontFamily: 'Exo-Bold',
 fontSize: 52,
 color: '#fcea61',
 backgroundColor:'transparent',
 textAlign :'center',
 marginLeft : 10,
},
participants_text:{
   fontFamily: 'Exo-Medium',
   fontSize: 16,
   color: '#ffffff',
   backgroundColor:'transparent',
   textAlign :'center',
   marginLeft : 10,
},
middle_view: {
  height: 46,
  width: screenWidth,
  marginTop: '15%',
  backgroundColor:'rgba(226, 86, 86, 0.59)',
  flexDirection: 'row',
  justifyContent: 'space-around'
},
participants__view:
{
  justifyContent: 'center',
  alignItems: 'center',
},
participants_sub_view: {
  flexDirection: 'row',
  alignItems: 'center',
},
bottom_view: {
  bottom:0,
  width: screenWidth,
  backgroundColor:'rgba(0, 0, 0, 0.71)',
},
bottom_price_view: {
  height:70,
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
},
first_price_text:{
     fontFamily: 'Exo-Bold',
     fontSize: 20,
     color: '#f19604',
     backgroundColor:'transparent',
     textAlign :'center',
},
first_price_text1:{
     fontFamily: 'Exo-Regular',
     fontSize: 25,
     color: '#ffffff',
     backgroundColor:'transparent',
     textAlign :'center',
},
first_price_coin_view: {
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
  marginTop:1,
},
first_price_text_view: {
  marginLeft: 5,
},
first_price_coin_text:{
     fontFamily: 'Exo-Regular',
     fontSize: 25,
     marginTop:1,
     color: '#ffffff',
     backgroundColor:'transparent',
     textAlign :'center',
     marginLeft: 5,
},
seperator: {
  height: 1,
  width: screenWidth,
  top: 0,
  backgroundColor:'white',
},
other_price_container__main_view: {
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
},
other_price_container_view: {
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
  flex:1,
  height:70
},
other_price_text:{
   fontFamily: 'Exo-Bold',
   fontSize: 11,
   color: '#f19604',
   backgroundColor:'transparent',
   textAlign :'center',
   marginLeft:-6,
   marginTop:5,
},
other_price_text_view: {
  marginLeft: 5,
},
first_price_text1:{
   fontFamily: 'Exo-Regular',
   fontSize: 18,
   color: '#ffffff',
   backgroundColor:'transparent',
   textAlign :'center',
},
other_price_coin_view: {
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
  marginTop: -3,
},
other_price_coin_text:{
     fontFamily: 'Exo-Regular',
     fontSize: 18,
     color: '#ffffff',
     backgroundColor:'transparent',
     textAlign :'center',
     marginLeft: 3,
},
});

export default styles;
