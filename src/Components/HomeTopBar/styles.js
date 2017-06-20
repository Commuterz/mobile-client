import { StyleSheet, Platform,Dimensions } from 'react-native'
const { width: screenWidth, height: screenHiehgt } = Dimensions.get('window');
const ASPECT_RATIO = screenWidth / screenHiehgt;

/* Styles ==================================================================== */
const styles = StyleSheet.create({

  topBar: {
    paddingTop: Platform.select({
      ios: 20,
      android: 0,
    }),
    height: Platform.select({
      ios: 80,
      android: 60,
    }),
    backgroundColor: '#272727',
    flexDirection: 'row',
    alignItems: 'center',
  },
  topBarContentWrapper: {
    flex: 1,
    marginHorizontal: 12,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonMenuWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  imageMenu:{

  },
  userInfoContainer: {
    flex: 1,
    marginRight: 5,
    backgroundColor: 'transparent',
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userPrizeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderTopLeftRadius: 22,
    borderBottomLeftRadius: 22,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

  },

  imageToken: {
    width: 19,
    height: 19,
    marginLeft:'30%'
  },
  textToken: {
    fontFamily: 'Exo-Medium',
    fontSize: 22,
    color: '#944b13',
    marginLeft: 4,
    width:'60%'
  },
  shopContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5fdf71',
    borderBottomRightRadius: 11,
    borderTopRightRadius: 11,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarWrapper: {
    position: 'absolute',
    top: -1,
    left: 0,
    height: 46,
    width: 46,
    borderRadius: 23,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight:5
  },
  imageAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginLeft:1
  },
  textShop: {
    fontFamily: 'Exo-Medium',
    fontSize: 22,
    color: '#fff',
  },



  topContainer: {
    flexDirection: 'row',
    height: 76,
    paddingHorizontal: 17,
    backgroundColor: 'rgba(69, 149, 250, 0.9)',
  },
  topCellContainer: {
    flex: 1,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topPaddingContainer: {
    width: 16,
  },
  textFieldName:{
    fontFamily: 'Exo-DemiBold',
    height: 21,
    fontSize: 16,
    color: '#fff',
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
  textCurrentPrize: {
    fontFamily: 'Exo-Bold',
    fontSize: 30,
    color: '#fcea61',
    marginLeft: 5,
  },
  timeFieldContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textTimeValue: {
    fontFamily: 'Exo-Bold',
    fontSize: 20,
    color: '#fff',
    height: 27,
  },
  textTimeLabel: {
    fontFamily: 'Exo-Medium',
    fontSize: 8,
    color: '#929497',
  },
  bottomGoContainer: {
    height: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowColor: '#000',
    shadowOpacity: 1.0,
    shadowRadius: 10,
  },
  inputTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputText: {
    flex: 1,
    fontFamily: 'Exo-Regular',
    fontSize: 17,
    height: 53,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  locationAddress: {
    fontFamily: 'Exo-Regular',
    fontSize: 17,
  },
  line: {
    height: 1,
    width: screenWidth,
    backgroundColor: '#4595fa',
  },
  imageWrapper: {
    width: 54,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageSearch: {
    width: 18,
    height: 18,
  },
  imageDesination: {
    width: 24,
    height: 31,
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5fdf71',
    height: 44,
  },
  textButton: {
    fontFamily: 'Exo-Medium',
    fontSize: 22,
    color: '#fff',
  },
  imageRabbit: {
    width: 29,
    height: 17,
  },
  bottomSendRequestContainer: {
    height: 97,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowColor: '#000',
    shadowOpacity: 1.0,
    shadowRadius: 10,
  },
  textCostOfRide: {
    fontFamily: 'Exo-Medium',
    fontSize: 25,
    color: '#4595fa',
  },
  textCostOfRideValue: {
    fontFamily: 'Exo-Bold',
    fontSize: 30,
    color: '#4595fa',
  },
  imageDestinationLocationMarker: {
    width: 47,
    height: 61,
    alignItems: 'center',
  },
  destionationCallout: {
    width: 184,
    height: 47,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  textAddress: {
    fontFamily: 'Exo-Medium',
    fontSize: 12,
    color: '#fff',
  },
  textDistance: {
    fontFamily: 'Exo-Medium',
    fontSize: 18,
    color: '#fff',
  },
  arrow: {
    backgroundColor: 'transparent',
    borderWidth: 5,
    borderColor: 'transparent',
    borderTopColor: 'rgba(0, 0, 0, 0.7)',
    alignSelf: 'center',
  },
  textSendRequestTitle:{
   fontFamily: 'Exo-Bold',
    fontSize:25,
    color: '#4595fa',
    marginTop: 15,
  },
  textSendRequestOne:{
    fontFamily: 'Exo-Regular',
    fontSize:18,
    color: '#929497',
    marginTop: 18,
    textAlign :'center',
  },
  textSendRequestTwo:{
    fontFamily: 'Exo-Regular',
    fontSize:18,
    color: '#929497',
    marginTop: 5,
  },
  textSendRequestApprove:{
    fontFamily: 'Exo-Regular',
    fontSize:14,
    color: '#A9A9A9',
    marginTop: 1,
  },
  textSendRequestTerms:{
    fontFamily: 'Exo-Medium',
    fontSize:14,
    color: '#4595fa',
    marginTop: 1,
  },
  buttonSendRequestApprove:{
    backgroundColor: '#5fdf71',
    height:45,
    width:'50%',
    borderRadius:1,
    justifyContent:'center',
    alignItems:'center',
  },
  buttonSendRequestDecline:{
    backgroundColor: '#ff0000',
    height: 45,
    width:'30%',
    borderRadius:1,
    marginLeft:16,
    justifyContent:'center',
    alignItems:'center',
  },
  popUpButtonText: {
    fontFamily: 'Exo-Medium',
    textAlign:'center',
    color:'#fff',
    fontSize: 18,
  },

  driverBottomRequestContainer: {
    height: 280,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowColor: '#000',
    shadowOpacity: 1.0,
    shadowRadius: 10,
  },
  driverNameTest:{
    fontFamily: 'Exo-Medium',
    textAlign:'center',
    color:'#fff',
    fontSize: 18,
    fontStyle :'italic',
  },
  driverRideTokenAmount:{
    fontFamily: 'Exo-Bold',
    textAlign:'center',
    color:'#fff',
    fontSize: 30,
    marginTop: -9
  },
  driverImageToken:{
    width:16,
    height:16,
  },
  driverRidePriceText:{
    fontFamily: 'Exo-Regular',
    textAlign:'center',
    color:'#fff',
    fontSize: 18,

  },
  driverPickupRequestView:{
    backgroundColor: '#5fdf71',
    height:100,
  },
  driverAvatarWrapper: {
    width: 52,
    height: 52,
    borderRadius: 23,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverImageAvatar: {
    width: 52,
    height: 52,
    borderRadius: 23,
  },
  driverTextPickUp:{
    fontFamily: 'Exo-Medium',
    textAlign:'center',
    color:'#fff',
    fontSize: 24,
  },
  driverAcceptRideBtn:{
    backgroundColor: '#5fdf71',
    height:50,
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverDeclineRideBtn:{
    backgroundColor: '#ff0000',
    height:50,
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverRideApprovedRectangle:{
    height: 103,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowColor: '#000',
    shadowOpacity: 0.9,
    shadowRadius: 12,
  },
  rideApproveTimePickUp:{
    width:'45%',
    fontFamily: 'Exo-Medium',
    fontSize: 16,
    textAlign: 'center',
    color: '#4595fa',
    fontWeight :'600',

  },
  rideViewRectangle:{
    width:'45%',
    flexDirection:'row',
    backgroundColor:'#262626',
    height:54,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:5,
  },
  rideViewRectangleRight:{
    width:'45%',
    marginLeft:10,
    flexDirection:'row',
    backgroundColor:'#262626',
    height:54,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:5,
  },
  rideApproveTextTimeDistance:{
    fontFamily: 'Exo-Bold',
    fontSize: 35,
    textAlign: 'center',
    color: '#FFF',
  },
  rideApproveTextMinMiles:{
    fontFamily: 'Exo-Regular',
    fontSize: 18,
    textAlign: 'center',
    color: '#FFF',
    marginTop:10,
    marginLeft:3,

  },

});

export default styles;