'use strict';

import React, {Component} from 'react';
import {View, Text,Image,TextInput,StyleSheet,TouchableOpacity,Alert,AsyncStorage} from 'react-native';
import BackgroundImage from '@Components/BackgroundImage'
import { Actions, Scene } from 'react-native-router-flux'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


export default class MainPage extends Component
{
  constructor(props) {
    super(props);
  }
 componentDidMount() {

  }

componentWillMount(){
  // AsyncStorage.getItem("isLogin", (errs,result) => {
  //      if (!errs) {
  //          if (result !== null && result === '1') {
  //             Actions.home();
  //          }else{
  //            Actions.login();
  //          }
  //       }
  //  });

  Actions.home();
}
  render()
  {
    return (

      <BackgroundImage source={require("@Resources/Images/splash.png")}>
        <View style={{flex: 1, alignItems: 'center',}}>

        </View>
      </BackgroundImage>
    );
  }

  sendAgain(){

  }
}
