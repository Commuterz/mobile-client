'use strict';

import React, {Component} from 'react';
import {View, Text,Image,TextInput,StyleSheet,TouchableOpacity,Alert} from 'react-native';
import BackgroundImage from '@Components/BackgroundImage'
import { Actions, Scene } from 'react-native-router-flux'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


export default class VerifyPhone extends Component
{
  constructor(props) {
    super(props);
  }
 componentDidMount() {
  }

  render()
  {
    return (

      <BackgroundImage source={require("@Resources/Images/verify-phone-bg.png")}>
        <View style={{flex: 1, alignItems: 'center',backgroundColor:'rgba(0, 0, 0, 0.36)'}}>
          <Text style={{fontSize:30, color:'#FFF',fontFamily:'Exo-Medium', marginTop:'40%'}}>Enter Verification Code</Text>
          <TextInput underlineColorAndroid='transparent' style={{width:'50%',fontSize:30, color:'#FFF',fontFamily:'Exo-Medium', marginTop:'10%',letterSpacing:12}} ></TextInput>
          <View style={{width:'50%',backgroundColor:'#FFF',height:2,}}></View>
          <Text style={{fontSize:20, color:'#61a8fc',fontFamily:'Exo-Medium', marginTop:'10%'}} onPress={this.sendAgain.bind(this)}>Send Again</Text>
        </View>
      </BackgroundImage>
    );
  }

  sendAgain(){

  }
}
