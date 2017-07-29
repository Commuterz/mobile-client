import React, { Component } from 'react'
import { Image,View,TouchableOpacity,Text,Alert,AsyncStorage } from 'react-native'
import styles from './styles'
import {LoginManager} from 'react-native-fbsdk';
import { Actions, Scene } from 'react-native-router-flux'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import loginUserApiCall from '@API/loginUserApiCall'
import Spinner from 'react-native-loading-spinner-overlay';

class HomeTopBar extends Component {
  constructor(props){
    super(props)
    this.state={
      loaderVisible:false,
    }
  }

  onMenu() {
    Alert.alert("Logout", "Are you sure you want to logout?" ,
    [

      {text: 'Yes', onPress: () => this.logoutUser()},
      {text: 'Not Now', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
     ] )
  }

logoutUser(){
    AsyncStorage.setItem("userPrivateKey", '')
    AsyncStorage.setItem("userEthereumAddress", '')
    AsyncStorage.setItem("userIpfs", '')
    AsyncStorage.setItem("isLogin",'0')
    this.logoutFromFacebook();
    Actions.login();
}
// logout from facebook
logoutFromFacebook(){
    LoginManager.logOut();
}
onShop() {
  var self = this;
  self.setState({loaderVisible:true});
  AsyncStorage.getItem("userPrivateKey", (errs,userPrivateKey) => {
       if (!errs) {
           if (userPrivateKey !== null) {
             loginUserApiCall.shopCall(userPrivateKey ,function(err,result){
               console.warn('shop result' + result);
               if(result){

                 Alert.alert( 'Alert', 'You have shoped successfully.',
                [ {text: 'Ok', onPress: () => self.setState({loaderVisible:false})}, ], { cancelable: false } )

               }else{
                 self.setState({loaderVisible:false});
                 Alert.alert('Alert','Error '+err,
                [ {text: 'Ok', onPress: () => self.setState({loaderVisible:false})}, ], { cancelable: false });
               }
             });
          }
        }
   });
}


render() {
    const {tokenBalance,loginProfilePic,source, children, style, ...props} = this.props

    let pic = {
      uri: loginProfilePic,
   };
    return (

      <View style={ styles.topBar }>
        <View style={ styles.topBarContentWrapper }>
          <TouchableOpacity activeOpacity={ .5 } onPress={ () => this.onMenu() }>
            <View style={ styles.buttonMenuWrapper }>
              <Image source={require("@Resources/Images/menu-icon.png") } style={ styles.imageMenu }/>
            </View>
           </TouchableOpacity>
            <View style={ styles.userInfoContainer }>
            <View style={ styles.userPrizeContainer }>
              <Image source={ require("@Resources/Images/token.png") } style={ styles.imageToken }/>
              <Text style={ styles.textToken } numberOfLines={1}>{tokenBalance}</Text>
            </View>
            <TouchableOpacity activeOpacity={ .5 } onPress={ () => this.onShop() } style={ styles.shopContainer }>
              <Text style={ styles.textShop }>Shop</Text>
            </TouchableOpacity>
            <View style={ styles.avatarWrapper }>
              {loginProfilePic === '' &&
                <Image source={require("@Resources/Images/oval.png")} style={ styles.imageAvatar }/>
              }
              {loginProfilePic !='' &&
                <Image source={pic} style={ styles.imageAvatar }/>
              }
            </View>
          </View>
        </View>
        <Spinner overlayColor={ "rgba(0, 0, 0, 0.65)" } visible={this.state.loaderVisible}
         textContent={"Please wait.."} textStyle={{color: '#FFF',fontFamily:"Exo-Regular"}} ></Spinner>
      </View>

    )
  }
}

HomeTopBar.propTypes = {
  source: React.PropTypes.number,
  children: React.PropTypes.object,
  style: React.PropTypes.object
}
export default HomeTopBar
