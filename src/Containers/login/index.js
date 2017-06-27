'use strict';

import React, {Component} from 'react';
import {View, StatusBar, Text,Image,TextInput,StyleSheet,TouchableOpacity,Alert,AsyncStorage,NetInfo,Platform} from 'react-native';
import BackgroundImage from '@Components/BackgroundImage'
import styles from './styles'
import { Actions, Scene } from 'react-native-router-flux'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {onFBLogin} from '@Actions/fbloginActions'
import registerApiCall from '@API/registerApiCall'
import api from '@API/api';
import Spinner from 'react-native-loading-spinner-overlay';
import { AccessToken,LoginButton, LoginManager,GraphRequest,GraphRequestManager } from 'react-native-fbsdk';
import webAPICall from '@API/webAPICall'
import {addProfileJSON,statusBarColor} from '@lib/constants'
var BigNumber = require('bignumber.js');

//var ipfs = require('ipfs-js');
/**
 * Bind all the functions from the ```actions``` and bind them with
 * ```dispatch```
 */
 const actions = [
   onFBLogin
 ];

var userPrivateKey;
var userEthereumAddress;
var userPassword;
var userSalt = "commuterz";
var userIpfs = "";
var facebookProfileResult;
var hideView = true;
class Login extends Component
{

  constructor(props)
  {
    super(props);
    this.state = {
      loaderVisible: false,
      hideOtherComponent:hideView,
    };

  }

componentDidMount(){

}
componentWillMount(){
  this.setState({hideOtherComponent:true})
  var  self = this;
  AsyncStorage.getItem("isLogin", (errs,result) => {
       if (!errs) {
           if (result !== null && result === '1') {
              Actions.home({type: "replace"});
           }
        }
   });
}
/******Login from facebook and allow permissions @author SynsoftGlobal**************/
 _loginWithFacebook()
 {

   //this.logoutFromFacebook();
   //LoginManager.setLoginBehavior(LoginManager.LoginBehaviors.WEB_VIEW_ONLY); // defaults to Native
  LoginManager.setLoginBehavior(Platform.OS === 'ios' ? 'web' : 'web_only')
   var self = this;
   LoginManager.logInWithReadPermissions(['public_profile','email']).then(
    function(result) {
      if (result.isCancelled) {
        Alert.alert('Alert',"Login cancelled");
      } else {
        //self.props.actions.onFBLogin();
        //alert("alert");
        self.fetchUserData();
        self.setState({loaderVisible:true})
      }
    },
    function(error) {
        Alert.alert("Alert",'Login fail with error: ' + error);
    }
  );
}

/******Fetching profile data from facebook @author SynsoftGlobal**************/
fetchUserData(){
  var self = this;
  const responseInfoCallback = function(error, result) {
    if (error) {
      console.log(error)
      Alert.alert('Alert','Error fetching data: ' + error.toString());
    } else {
      console.log(result)
      //Alert.alert('Facebook Profile Data',JSON.stringify(result));
      userPassword = result.id;
      facebookProfileResult = result;
      self.registerUser();
    }
  }
  // Create a graph request asking for user email and names with a callback to handle the response.
  const infoRequest = new GraphRequest(
    '/me',
    {
      parameters: {
        fields: {
          string: 'email,name,first_name,picture,last_name'
        }
      }
    },
    responseInfoCallback
  );
  // Start the graph request.
  new GraphRequestManager().addRequest(infoRequest).start()
}
// logout from facebook
logoutFromFacebook(){
    LoginManager.logOut();
}

registerUser(){
  var self =this;
  AsyncStorage.getItem('isNetworkAvailable', (err, result) =>
  {
    if(result=='true')
    {

      userPrivateKey = api.getPrivateKey(userPassword, userSalt);
      userEthereumAddress = api.privateKeyToAddress(userPrivateKey);
      AsyncStorage.setItem("userPrivateKey", userPrivateKey)
      AsyncStorage.setItem("userEthereumAddress", userEthereumAddress)
      registerApiCall.etherInRegistration(userEthereumAddress,function(err,result){
          if(result){
              //alert("etherInRegistration" +result);
              self.checkIsAlreadyRegister(userEthereumAddress);
            }else{
              Alert.alert("Alert","Error in registration.\n" +err)
              self.setState({loaderVisible:false})
          }
      });
    }
    else
    {
       Alert.alert('Alert','No network available');
    }
  });
}

/*******Method check or user registration If true it will login directly else process for registration calls***************/
checkIsAlreadyRegister(userEthereumAddress){
  var self = this;
  registerApiCall.isAlreadyRegistered(userEthereumAddress,function(err,result){
    if(err && result ==='false'){
      Alert.alert("Alert","Something went wrong while login \n" +err)
    }else{
      if(result){
          //alert("isAlreadyRegistered");
          self.addUserDataAndGetIPFS('1');//1 for user is already register
      }else{
        //alert("You are not registered user of commuterz");
        self.addUserDataAndGetIPFS('0');//0 for user is not  register
      }
    }

  });

}

/*****Adding user profiles and get ipfs token***************/
addUserDataAndGetIPFS(value){
  var jsonData = JSON.stringify(facebookProfileResult);
  console.log("FBDATA" +jsonData);
  var self = this;
  webAPICall.postApiWithJosnDataInMainThread(addProfileJSON,jsonData,'POST').then((result) =>
   {
    if(result)
      {
          //alert("Adding User Data and GET IPFS Token " + result.ipfshash);
            userIpfs = result.ipfshash;
            AsyncStorage.setItem("userIpfs", userIpfs)
            if(value === '1'){
              //alert("Open Map Page ");
              self.openHomeScreen();
            }else{
              //alert("Registering to Commuterz");
              self.registerUserToCommuterz();
            }
        }
    }).done();
}

/*****register user to commuterz with its ipfs token***************/
registerUserToCommuterz(){
  var self = this;
  //console.warn('userPrivateKey' +userPrivateKey +"userIpfs" +userIpfs)
  registerApiCall.registerUser(userPrivateKey,userIpfs,function(err,result){
      if(result){
          //alert("Registerion success Getting Token" );
          self.approveTokensToContract();
      }else{
        Alert.alert("Alert","Registration Failed.\n" + err)
        self.setState({loaderVisible:false})
      }

  });
}

/***********Approve token for contract to new register user*************************************/
approveTokensToContract(){
  var self = this;
  var tokens = 1000000;
  registerApiCall.approveTokenForRegisterUser(userPrivateKey,tokens,function(err,result){
      if(result){
        Alert.alert("Registration", "Registration completed successfully." ,
         [ {text: 'OK', onPress: () => self.openHomeScreen()}, ] )
      }else{
        Alert.alert("Alert","Something went wrong.\n" +err)
        self.setState({loaderVisible:false})
      }

  });
}
openHomeScreen(){
   this.setState({loaderVisible:false})
    AsyncStorage.setItem("isLogin",'1');
    Actions.home({type: "replace"});

}
_loginWithEmail(){
    Alert.alert("Alert","Comming Soon...")
}

_signUp()
  {
    Alert.alert('Alert','Coming Soon..');
  }

render()
  {
    const { fbLoginResponse, actions } = this.props;
    return (
      <BackgroundImage source={require("@Resources/Images/login-bg.png")}>
      <StatusBar  backgroundColor={statusBarColor} barStyle="light-content" />
        <View style={{flex: 1, alignItems: 'center',backgroundColor:'rgba(0, 0, 0, 0.36)'}}>
          <View style={{flexDirection:'row', marginTop:'28%'}}>
           <Image source={require('@Resources/Images/rabit-white.png')}/>
            <Text style={styles.textLogo}>ommuterz</Text>
          </View>
         <Text style={styles.textCarTitle}>Making Carpooling Fun Again</Text>

          {!this.state.hideOtherComponent &&
            <View style={{width:'85%', height:102,borderRadius:6,borderWidth:1,borderColor:'#FFFF'}}>

              <TextInput ref='1' style={styles.textInput} underlineColorAndroid='transparent' returnKeyType="next" keyboardType="email-address"  placeholder='Email' placeholderTextColor='#FFF' onSubmitEditing={() => this.refs[2].focus()}/>

             <View style={{backgroundColor:'#FFF',height:1}}></View>

              <TextInput ref='2' style={styles.textInput} underlineColorAndroid='transparent' secureTextEntry={true}  returnKeyType="done" placeholder='Password' placeholderTextColor='#FFF'/>
            </View>
          }

          {!this.state.hideOtherComponent &&
            <TouchableOpacity style={styles.loginButtonBg}  onPress={this._loginWithEmail.bind(this)}>
              <View style={{width:'100%',height:'100%',justifyContent:'center',alignItems:'center'}}>
                <Text style={styles.textbutton}>Sign In</Text>
              </View>
            </TouchableOpacity>
          }

            <TouchableOpacity style={styles.facebookButtonBg}  onPress={this._loginWithFacebook.bind(this)}>
            <View style={{width:'100%',height:'100%',justifyContent:'center',alignItems:'center'}}>
              <Text style={styles.textbutton}>Facebook Connect</Text>
            </View>
            </TouchableOpacity>


            {!this.state.hideOtherComponent &&
            <TouchableOpacity style={styles.signupButtonBg} onPress={this._signUp.bind(this)}>
            <View style={{width:'100%',height:'100%',justifyContent:'center',alignItems:'center'}}>
              <Text style={styles.textbutton}>SignUp</Text>
            </View>
            </TouchableOpacity>
           }

            <Spinner overlayColor={ "rgba(0, 0, 0, 0.75)" } visible={this.state.loaderVisible}
             textContent={"Please wait.."} textStyle={{color: '#FFF',fontFamily:"Exo-Regular"}} ></Spinner>

        </View>
      </BackgroundImage>
    );
  }

}

export default connect(state => ({
    ...state
  }),
  (dispatch) => ({
    actions: bindActionCreators({onFBLogin}, dispatch)
  })
)(Login);
