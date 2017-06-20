import React, { Component } from 'react'
import { Image,View,TouchableOpacity,Text,Alert,AsyncStorage } from 'react-native'
import styles from './styles'
import {LoginManager} from 'react-native-fbsdk';
import { Actions, Scene } from 'react-native-router-flux'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class HomeTopBar extends Component {
  constructor(props){
    super(props)
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
    Actions.login();
}
  onShop() {
      alert("Tapped Shop!");
  }
  render() {
    const {tokenBalance,loginProfilePic,source, children, style, ...props} = this.props
    //console.warn('image' +loginProfilePic );
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
