'use strict';
import React, {Component} from 'react';
import {View, Text, ScrollView, TouchableOpacity, Image,TextInput,Alert} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Actions, Scene } from 'react-native-router-flux'
import BackgroundImage from '@Components/BackgroundImage'
import Separator from '@Components/SeparatorView'
import styles from './styles'
import * as validation from '@lib/validation'

export default class SignUp extends Component
{
  constructor(props)
  {
    super(props);
    this.state = {
     userData: {
       fullName: undefined,
       phone: undefined,
       email: undefined,
       password: undefined,
       carType: undefined,
       carModel: undefined,
       carColor: undefined,
       yearModel: undefined,
       plateNumber: undefined,
       profilePic : undefined,
     }
   };
  }
  componentDidMount()
  {
    var updatedData = this.state.userData;
    if (this.props.fbResponce.data.name != undefined || this.props.fbResponce.data.name != '')
    {
        updatedData.fullName = this.props.fbResponce.data.name;
    }
    if (this.props.fbResponce.data.email != undefined || this.props.fbResponce.data.email != '')
    {
        updatedData.email = this.props.fbResponce.data.email;
    }
    this.setState({userData:updatedData});
  }
  focusNextField = (nextField) =>
  {
     this.refs[nextField].focus();
  };
  clickProflePic = () =>
  {
    /*
    let source = { uri: response.uri };
    var updatedData = this.state.userData;
    updatedData.profilePic = source;
    this.setState({userData:updatedData});
    */
  }
  callSignUp = () =>
  {
    if(!validation.emptyTextValidation(this.state.userData.fullName))
    {
      Alert.alert('Alert','Please enter Full Name');
      return
    }
    if(!validation.emptyTextValidation(this.state.userData.phone))
    {
      Alert.alert('Alert','Please enter Phone Number');
      return
    }
    if(!validation.emptyTextValidation(this.state.userData.email))
    {
      Alert.alert('Alert','Please enter Email');
      return
    }
    if(!validation.validateEmail(this.state.userData.email))
    {
      Alert.alert('Alert','Email not valid');
      return
    }
    if(!validation.emptyTextValidation(this.state.userData.password))
    {
      Alert.alert('Alert','Please enter Password');
      return
    }
    if(this.state.userData.password.length < 6)
    {
       Alert.alert('Alert','Password length should be minimum 6 character');
       return
    }

    if(!validation.emptyTextValidation(this.state.userData.carType))
    {
      Alert.alert('Alert','Please enter Car Type');
      return
    }
    if(!validation.emptyTextValidation(this.state.userData.carModel))
    {
      Alert.alert('Alert','Please enter Car Model');
      return
    }
    if(!validation.emptyTextValidation(this.state.userData.carColor))
    {
      Alert.alert('Alert','Please enter Car Color');
      return
    }
    if(!validation.emptyTextValidation(this.state.userData.yearModel))
    {
      Alert.alert('Alert','Please enter Year Model');
      return
    }
    if(!validation.emptyTextValidation(this.state.userData.plateNumber))
    {
      Alert.alert('Alert','Please enter Plate Number');
      return
    }

    var postData =  JSON.stringify(this.state.userData);
    Actions.home();
  }

  render()
  {
    let profileButton = null;
    if (this.state.userData.profilePic === undefined || this.state.userData.profilePic === '')
    {
        profileButton = <View style = {styles.topProfilePicView}>
        <TouchableOpacity onPress={this.clickProflePic}>
           <Image
             style={styles.profileButton}
             source={require("@Resources/Images/add-photo.png")}
           />
         </TouchableOpacity>
         <Image
           style={styles.profilePlusIcon}
           source={require("@Resources/Images/plus.png")}
         />
        </View>
    }
    else
    {
      profileButton =
      <View style = {styles.topProfilePicView}>
         <TouchableOpacity onPress={this.clickProflePic}>
            <Image
              style={styles.profileButton}
              source={this.state.userData.profilePic}
            />
          </TouchableOpacity>
      </View>
    }

    return (
        <BackgroundImage source={require("@Resources/Images/signup-bg.png")}>
          <KeyboardAwareScrollView>
            {profileButton}
            <View style={styles.textBorderView}>
              <Separator />
              <TextInput
                style={styles.input}
                placeholderTextColor = 'white'
                autoCapitalize = 'words'
                ref= 'fullName'
                placeholder ='Full Name'
                keyboardType = 'default'
                returnKeyType = 'next'
                maxLength = {50}
                value = {this.state.userData.fullName}
                onChangeText={(text) =>
                {
                  var updatedData = this.state.userData;
                  updatedData.fullName = text;
                  this.setState({userData:updatedData});
                }}
                onSubmitEditing={() => this.focusNextField('phone')}
              />
              <Separator />
              <TextInput
                style={styles.input}
                placeholderTextColor = 'white'
                color = 'white'
                autoCapitalize = 'words'
                ref= 'phone'
                placeholder ='Phone'
                keyboardType = 'phone-pad'
                returnKeyType = 'next'
                maxLength = {50}
                onChangeText={(text) =>
                {
                  var updatedData = this.state.userData;
                  updatedData.phone = text;
                  this.setState({userData:updatedData});
                }}
                onSubmitEditing={() => this.focusNextField('email')}
              />
              <Separator />
              <TextInput
                style={styles.input}
                placeholderTextColor = 'white'
                color = 'white'
                autoCapitalize = 'words'
                ref= 'email'
                placeholder = 'Email'
                keyboardType = 'email-address'
                returnKeyType = 'next'
                maxLength = {50}
                value = {this.state.userData.email}
                onChangeText={(text) =>
                {
                  var updatedData = this.state.userData;
                  updatedData.email = text;
                  this.setState({userData:updatedData});
                }}
                onSubmitEditing={() => this.focusNextField('password')}
              />
              <Separator />
              <TextInput
                style={styles.input}
                placeholderTextColor = 'white'
                color = 'white'
                autoCapitalize = 'words'
                ref = 'password'
                placeholder ='Password'
                keyboardType = 'default'
                returnKeyType = 'next'
                secureTextEntry = {true}
                maxLength = {50}
                onChangeText={(text) =>
                {
                  var updatedData = this.state.userData;
                  updatedData.password = text;
                  this.setState({userData:updatedData});
                }}
                onSubmitEditing={() => this.focusNextField('carType')}
              />
              <Separator />
              <TextInput
                style={styles.input}
                placeholderTextColor = 'white'
                color = 'white'
                autoCapitalize = 'words'
                ref= 'carType'
                placeholder ='Car Type'
                keyboardType = 'default'
                returnKeyType = 'next'
                maxLength = {50}
                onChangeText={(text) =>
                {
                  var updatedData = this.state.userData;
                  updatedData.carType = text;
                  this.setState({userData:updatedData});
                }}
                onSubmitEditing={() => this.focusNextField('carModel')}
              />
              <Separator />
              <TextInput
               style={styles.input}
               placeholderTextColor = 'white'
               color = 'white'
               autoCapitalize = 'words'
               ref= 'carModel'
               placeholder ='Car Model'
               keyboardType = 'default'
               returnKeyType = 'next'
               maxLength = {50}
               onChangeText={(text) =>
               {
                 var updatedData = this.state.userData;
                 updatedData.carModel = text;
                 this.setState({userData:updatedData});
               }}
               onSubmitEditing={() => this.focusNextField('carColor')}
              />
              <Separator />
              <TextInput
                style={styles.input}
                placeholderTextColor = 'white'
                color = 'white'
                autoCapitalize = 'words'
                ref= 'carColor'
                placeholder ='Car Color'
                keyboardType = 'default'
                returnKeyType = 'next'
                maxLength = {50}
                onChangeText={(text) =>
                {
                  var updatedData = this.state.userData;
                  updatedData.carColor = text;
                  this.setState({userData:updatedData});
                }}
                onSubmitEditing={() => this.focusNextField('yearModel')}
              />
              <Separator />
              <TextInput
                style={styles.input}
                placeholderTextColor = 'white'
                color = 'white'
                autoCapitalize = 'words'
                ref= 'yearModel'
                placeholder ='Year Model'
                keyboardType = 'default'
                returnKeyType = 'next'
                maxLength = {50}
                onChangeText={(text) =>
                {
                  var updatedData = this.state.userData;
                  updatedData.yearModel = text;
                  this.setState({userData:updatedData});
                }}
                onSubmitEditing={() => this.focusNextField('plateNumber')}
              />
              <TextInput
                style={styles.input}
                placeholderTextColor = 'white'
                color = 'white'
                autoCapitalize = 'words'
                ref= 'plateNumber'
                placeholder ='Plate Number'
                keyboardType = 'default'
                returnKeyType = 'done'
                maxLength = {50}
                onChangeText={(text) =>
                {
                  var updatedData = this.state.userData;
                  updatedData.plateNumber = text;
                  this.setState({userData:updatedData});
                }}
              />
            </View>
            <View style = {styles.signUpButton}>
              <TouchableOpacity onPress={this.callSignUp}>
                 <Text style={styles.signUpButtonText}>SignUp</Text>
              </TouchableOpacity>
            </View>
            <View style = {styles.termsConditionView}>
              <Text style={styles.termsConditionText}>By joining you agree to our</Text>
              <TouchableOpacity onPress={this.clickProflePic}>
                 <Text style={styles.termsConditionButton}>Terms and Conditions</Text>
              </TouchableOpacity>
            </View>
            </KeyboardAwareScrollView>
         </BackgroundImage>
    );
  }'use strict';
}
