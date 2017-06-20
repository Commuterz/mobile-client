import React, { Component , PropTypes,} from 'react';
import {StyleSheet,View,Image,TextInput,Keyboard,Alert,Dimensions,TouchableOpacity,StatusBar,Platform,Text,} from 'react-native';
var {GooglePlacesAutocomplete} = require('react-native-google-places-autocomplete');


export default class AutoCompleteAddressModel extends Component {
  static defaultProps = {
     isVisible: false,
   };
   
   static propTypes = {
     isVisible: PropTypes.bool,
     onSelect: PropTypes.func,
     onCancel : PropTypes.func,
   };
   constructor(props)
   {
     super(props);
     this.state = {
       isVisible: props.isVisible,
     };
   }

  render()
  {
    return (
      <View style={{ flex:1 }}>
           <View style={{height:20,backgroundColor:'rgba(38,164,206,1)'}}></View>
           <GooglePlacesAutocomplete
            placeholder='Search'
            istViewDisplayed='auto'
            minLength={2} // minimum length of text to search
            autoFocus={false}
            fetchDetails={true}
            styles={{     textInputContainer: {
            backgroundColor: 'rgba(0,0,0,0)',
            borderTopWidth: 0,
            borderBottomWidth:0,
            marginTop:20
          },
          textInput: {
            marginLeft: 0,
            marginRight: 0,
            height: 38,
            color: '#5d5d5d',
            fontSize: 16
          },
          predefinedPlacesDescription: {
            color: '#1faadb'
          },
        }}

        onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
          console.log("data",data);
          console.log("detail",details);
          //this.setState({toAddress:data.description});
          //this.setState({modalVisible1:false});
          if (!this.props.onSelect ||
            this.props.onSelect(data.description) !== false)
            {
            }
          }}

        getDefaultValue={() => {
          return '';
          // text input default value
        }}
        query={{
          // available options:
          url:'https://developers.google.com/places/web-service/autocomplete' ,
          key:'AIzaSyD0Hxmadm8GV0PkyqHw6ojzponR3fxG9BA',
          language:'en', // language of the results
          types:'geocode', // default: 'geocode'
        }}
        styles={{
          description: {
            fontWeight: 'bold',
          },
          predefinedPlacesDescription: {
            color: '#085DAD',
          },
        }}

        currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
        currentLocationLabel=""
        nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
        GoogleReverseGeocodingQuery={{
          // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
        }}
        GooglePlacesSearchQuery={{
          // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
          rankby: 'distance',
          types: 'food',
        }}
        filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}

        renderRightButton={() =>    <TouchableOpacity activeOpacity={ .5 } style={{alignItems: 'center',justifyContent: 'center',}}
        onPress={() => {  if (!this.props.onCancel ||
          this.props.onCancel() !== false)
          {
          }}}>
          <Text>Cancel</Text>
        </TouchableOpacity>}
      />

    </View>
    )
  }
}
