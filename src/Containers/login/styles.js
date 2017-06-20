
import { StyleSheet, Platform } from 'react-native'
/* Styles ==================================================================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor:'rgba(0, 0, 0, 0.36)',
  },
  textLogo:{
    fontSize:35,
    color:'#FFFF',
    height:76,
    marginTop:20,
    marginLeft:-18,
    fontFamily:'Exo-Medium'
  },
  textInput:{
    height: 50,
    color:'#FFF',
    fontSize:18,
    paddingLeft:10,
    fontFamily:'Exo-Medium'
  },
  loginButtonBg:{
    width: '80%',
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.21)',
    marginTop:'5%'
  },
  facebookButtonBg:{
    width: '80%',
    height: 48,
    backgroundColor: '#38569d',
    marginTop:'5%'
  },
  signupButtonBg:{
    width: '80%',
    height: 48,
    backgroundColor: '#5fdf71',
    marginTop:'5%'
  },
  textbutton:{
    fontSize:22,
    color:'#FFF',
    fontFamily:'Exo-Medium',
    textAlign :'center',
  },

});

export default styles;
