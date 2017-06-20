import React, { Component } from 'react';
import {StyleSheet,Text,View,Image,TextInput,Keyboard,Alert,Dimensions,TouchableOpacity,StatusBar,
  Platform, PermissionsAndroid,Modal,} from 'react-native';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import * as homeActions from '../actions';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Spinner from 'react-native-loading-spinner-overlay';
import Geocoder from 'react-native-geocoding';
import AutoCompleteAddressModel from './AutoCompleteAddressModel'
import BackgroundTimer from 'react-native-background-timer';
import PopupDialog from 'react-native-popup-dialog';
import { fetchRiderBalanceDispatcher } from '../actions'

import commuterzstyles from '../../utility/commuterzstyles'
import api from '../../utility/api';
import RiderApiCalling from '../../utility/RiderApiCalling';
import DriverApiCalling from '../../utility/DriverApiCalling';
import WebAPIEndPoint from '../../utility/WebAPIEndPoint'


import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';

const { width: screenWidth, height: screenHiehgt } = Dimensions.get('window');
const menuIcon = require('../../../assets/imgs/menu-icon.png');
const ovalIcon = require('../../../assets/imgs/oval.png');
const tokenIcon = require('../../../assets/imgs/token.png');
const searchIcon = require('../../../assets/imgs/search-blue.png');
const destinationIcon = require('../../../assets/imgs/destination-flag-blue.png');
const rabbitIcon = require('../../../assets/imgs/rabbit-icon-white.png');
const focusLocationIcon = require('../../../assets/imgs/focusLocation.png');
const currentLocationIcon = require('../../../assets/imgs/currentLocation.png');
const destinationLocationIcon = require('../../../assets/imgs/destination-flag-yellow.png');
const calculatingRouteIcon = require('../../../assets/imgs/calculating-route.png');
const clockIcon = require('../../../assets/imgs/clock.png');
const destinationIconDriver = require('../../../assets/imgs/destination-icon-driver.png');
const driverLocation = require('../../../assets/imgs/driver-location.png');
const pathIcon = require('../../../assets/imgs/path-icon.png');
const carIcon = require('../../../assets/imgs/driver-car.png');
const callIcon = require('../../../assets/imgs/call-icon.png');

const ASPECT_RATIO = screenWidth / screenHiehgt;
const latitudeDelta = 0.01;
const longitudeDelta= latitudeDelta * ASPECT_RATIO;
const ANCHOR = { x: 0.5, y: 0.5 };
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;

Geocoder.setApiKey('AIzaSyAZKNjTsWG_xTocHqtqRG5zClro6mR15Qk'); // use a  API key

const routeURL='https://maps.googleapis.com/maps/api/directions/json?origin=';
const routeKEY='AIzaSyAZKNjTsWG_xTocHqtqRG5zClro6mR15Qk';
const riderURL = "http://52.170.217.85:3000/riderequest";
const initialDistance =0;
let tokenBalanceValue = 0;
var tokenResult = false;
var rideId='';
class Home extends Component {
  constructor(props) {
    super(props);

    this._isMounted = false;
    this.latitudeDelta = latitudeDelta;
    this.longitudeDelta = longitudeDelta;

    let myPosition = {
      latitude: LATITUDE,
      longitude: LONGITUDE,
    };

    let destinationPosition = {
      latitude: LATITUDE,
      longitude: LONGITUDE,
    };

    this.state = {
      currentLocation: myPosition,
      destinationLocation: destinationPosition,
      destinationAddress: "My Destination Address",
      myLocationAddress: "My Current Location",
      calculatingRoute: false,
      isCalculatedResult: false,
      modalVisible: false,
      isDestinationSelected:false,
      isDestinationRouteDraw:false,
      routeDistance:initialDistance,
      routeCostToken:0,
      routeTotalTime:'0',
      routePolylines: [],
      TimeToRaffleHours:'00',
      TimeToRaffleMinutes:'00',
      TimeToRaffleSeconds:'00',
      tokenBalance:tokenBalanceValue,
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: this.latitudeDelta,
        longitudeDelta: this.longitudeDelta,
      },
      loaderVisible: false,
      deviceToken:'',

      isDriverApp: true,
      driverName:'',
      driverCurrentLocation:'',
      driverRideRequestCost:0,
      driverPickUpSource:'',
      driverPickUpDestination:'',
      driverPickUpSourceAddress:'',
      driverPickUpDestinationAddress:'',
      driverPickUpTime:'0',
      driverCurrentLocation:'',
      driverPickUpDistance:'',
      driverRideRequest:false,
      riderName:'John Williams',
      riderRequestPolyline:[],
      isDriverApprovedRide:false,


    };
    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle('light-content', false);
    }
  }

  componentDidMount() {
    this.fcmTokenAndNotificationHandling();
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        .then(granted => {
          if (granted) this.onMoveMyLocation();
        });
    } else {
      this.onMoveMyLocation();
    }

     this.fetchRiderBalanceDispatcher()

  }

  /***FCM noitification and token @author SynsoftGlobal**/
  fcmTokenAndNotificationHandling(){
    FCM.requestPermissions(); // for iOS
    FCM.getFCMToken().then(token => {
      // store fcm token in your server
       console.log('Token => '+token)
       this.setState({deviceToken:token})
   });


    this.notificationListener = FCM.on(FCMEvent.Notification, async (notif) => {
         // there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
     if(notif.local_notification){
         //this is a local notification
         return;
     }
     if(notif.opened_from_tray){
        this.showLocalNotificationForeground(notif);
     }
     if(Platform.OS ==='ios'){
             //optional
             //iOS requires developers to call completionHandler to end notification process. If you do not call it your background remote notifications could be throttled, to read more about it see the above documentation link.
             //This library handles it for you automatically with default behavior (for remote notification, finish with NoData; for WillPresent, finish depend on "show_in_foreground"). However if you want to return different result, follow the following code to override
             //notif._notificationType is available for iOS platfrom
           switch(notif._notificationType){
               case NotificationType.Remote:
                 notif.finish(RemoteNotificationResult.NewData) //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
                 break;
               case NotificationType.NotificationResponse:
                 notif.finish();
                 break;
               case NotificationType.WillPresent:
                 notif.finish(WillPresentNotificationResult.All) //other types available: WillPresentNotificationResult.None
                 break;
             }
           }
        this.showLocalNotificationForeground(notif);
   });

    this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, (token) => {
    console.log(token) // fcm token may not be available on first load, catch it here
    this.setState({deviceToken:token})
  });
   FCM.subscribeToTopic('/topics/riders');
   FCM.subscribeToTopic('/topics/drivers');
}

showLocalNotificationForeground(notif) {
   console.warn("Notif == " + JSON.stringify(notif))
   //alert(JSON.stringify(notif));
   if(this.state.isDriverApp){
     if(notif.type === 'Ride request'){
         Alert.alert('Ride Request', 'You have a new ride request');
         this.setState({driverRideRequest:true});
         this.updateDriverRideRequestData(notif);
     }else{
         Alert.alert('New Message', notif.type);
         this.setState({driverRideRequest:false});
     }
   }
  //  else{
  //       Alert.alert('New Message', notif.type);
  //       this.setState({driverRideRequest:false});
  //  }

}

componentWillMount() {
  this._isMounted = true;
   this.StartRaffleTimer();
}

componentWillUnmount() {
  this._isMounted = false;
}


onGo() {
  var destination = this.state.destinationAddress;
  if(destination === "My Destination Address"){
    Alert.alert( 'Alert', "Please choose destination." )
  }else{
      this.setState({ isCalculatedResult: true });
  }

}

findRouteBtwSourceAnDestination(){
  var  routeway=[];
  var currentLocation = this.state.currentLocation
  var toLoc =currentLocation.latitude+"," + currentLocation.longitude;
  var destinationLocation = this.state.destinationLocation;
  var fromLoc =destinationLocation.latitude+"," + destinationLocation.longitude;

  var URL =  routeURL+ toLoc +"&destination="+fromLoc+ "&units=imperial&mode=driving&key="+routeKEY+""
  //console.warn('URL  '+URL);
  WebAPIEndPoint.getApi(URL,'GET').then((responseJson) =>  {
    if(responseJson){
      if (responseJson.routes.length) {
         for(var i=0; i<responseJson.routes.length;i++){
            var routesList = responseJson.routes[i];
             for(var j=0; j<routesList.legs.length; j++){
               var legsList = routesList.legs[j];
               var distanceVal = legsList.distance.value;
               var time = legsList.duration.text;
               var disMiles = distanceVal / 1609.344;
                var tokenAmount = Math.round(disMiles);
                if(tokenAmount === 0){
                   tokenAmount = 1;
                }
              this.setState({routeCostToken:tokenAmount});
               this.setState({routeDistance:disMiles});
               this.setState({routeTotalTime:time});
                for(var s =0; s < legsList.steps.length; s++){
                   var stepsList = legsList.steps[s];
                   var polyPoints = stepsList.polyline.points;
                    var points =  this.decodePolyline(polyPoints,1);
                     for(var p =0;p < points.length;p++){
                        routeway.push(points[p]);
                     }
                }
             }
         }
         this.setState({routePolylines: [...routeway]});
         this.setState({ calculatingRoute: false });
         this.setState({isDestinationRouteDraw:true});

      //  alert("Done" + routeway.length+ " routePolylines" + this.state.routePolylines.length)
      }
    }else{
      Alert.alert("Alert","Something went wrong geting route directions." + JSON.stringify(responseJson.message))
      this.setState({ calculatingRoute: false });
    }
  })
  .done();

}

decodePolyline(str,precision)
{
       var index = 0, lat = 0, lng = 0,
       coordinates = [],
       shift = 0,
       result = 0,
       byte = null,
       latitude_change,
       longitude_change,
       factor = Math.pow(10, precision || 5);
       while (index < str.length) {
       // Reset shift, result, and byte
       byte = null;
       shift = 0;
       result = 0;
       do {
           byte = str.charCodeAt(index++) - 63;
           result |= (byte & 0x1f) << shift;
           shift += 5;
       } while (byte >= 0x20);

       latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));
       shift = result = 0;
       do {
           byte = str.charCodeAt(index++) - 63;
           result |= (byte & 0x1f) << shift;
           shift += 5;
       } while (byte >= 0x20);
       longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));
       lat += latitude_change;
       lng += longitude_change;
       coordinates.push({latitude:lat / 1E5,longitude:lng / 1E5});
   }
   return coordinates;
}

 /***getting balance of rider**/
fetchRiderBalanceDispatcher(){
    var selfBalance = this;
    api.getRiderBalance(function(err,result){
          if(result != undefined){
              selfBalance.setState({tokenBalance:result})
          }
      });
  }

fetchRiderPaysContract(tokenAmount){
      var self = this
      tokenAmount = tokenAmount * 1 // 1 token for 1 miles
      api.getNextRideId( function(err,result)
        {
          rideId = result;
          console.log('1 ride id'+rideId);
           //   self.callRiderPaysContractMethod(tokenAmount)
          RiderApiCalling.passangerRequestARide(tokenAmount,function(err,result){
             console.warn('result' + result);
             if(result){
                self.closePopUp();
              }
          });
        });
    }

/**Close popup dialog @author SynsoftGlobal**/
closePopUp()
    {
       this.popupDialog.dismiss();
        this.setState({
            loaderVisible: false
          });
      this.setState({routePolylines: []});
      this.setState({ isCalculatedResult: false });
      this.setState({ calculatingRoute: false });
      this.setState({isDestinationRouteDraw:false});
      this.setState({destinationAddress:'My Destination Address'})
      this.riderRequest();
      this.fetchRiderBalanceDispatcher();
  }

riderRequest(){
    var jsonData = JSON.stringify(
         {
          source: this.state.currentLocation,
          destination: this.state.destinationLocation,
          deviceToken: this.state.deviceToken,
          sourceAddress:this.state.myLocationAddress,
          destinationAddress:this.state.destinationAddress,
          rideDistance: this.state.routeDistance,
          costToken: this.state.routeCostToken,
          routeTime:this.state.routeTotalTime,
          rideId: rideId,
          riderId:'0x0fb374a56616bec8b8cb5a45bcd49e8e16b1abfb',
      })
    //  alert('Json' +JSON.stringify(jsonData))
    WebAPIEndPoint.postApiWithJosnDataInMainThread(riderURL,jsonData,'POST').then((responseJson) =>
     {
      if(responseJson)
        {
            console.log(JSON.stringify(responseJson));
          }
      }).done();
}


  onMenu() {
    alert("Tapped Menu!");
  }

  onShop() {
    alert("Tapped Shop!");
  }

  onMoveMyLocation() {
    navigator.geolocation.getCurrentPosition( (position) => {
        let myPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        this.setState({
          currentLocation: myPosition,
          myLocationAddress: position.coords.latitude.toString()+ ' ,' + position.coords.longitude.toString(),
        });
        this.setState({driverCurrentLocation:myPosition});
        this.setState({region:{latitude:position.coords.latitude,longitude:position.coords.longitude,latitudeDelta: 0.0922,
               longitudeDelta: 0.0421}});
        this.getAddressFromLatLng(position.coords.latitude,position.coords.longitude);
      },
      (error) => Alert.alert('Alert',"Unable to get your location."),
      { enableHighAccuracy: false, timeout: 30000, maximumAge: 1000 }
    );

    this.watchID = navigator.geolocation.watchPosition((position) =>
     {
        var lastPosition = JSON.stringify(position);
        let myPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        this.setState({
          currentLocation: myPosition,
          myLocationAddress: position.coords.latitude.toString()+ ' ,' + position.coords.longitude.toString(),
        });

        this.setState({driverCurrentLocation:myPosition});
        this.setState({region:{latitude:position.coords.latitude,longitude:position.coords.longitude,latitudeDelta: 0.0922,
               longitudeDelta: 0.0421}});
        this.getAddressFromLatLng(position.coords.latitude,position.coords.longitude);
      });
  }

  getAddressFromLatLng(lat, lng){
    //alert("getAddressFromLatLng" + lat +" , " +lng);
    Geocoder.getFromLatLng(lat,lng).then(
      json => {
        var address_component = json.results[0].address_components[0];
        var address = address_component.long_name;
        var formatedAddress = json.results[0].formatted_address;
        var placeId = json.results[0].place_id;
        this.setState({myLocationAddress:formatedAddress});
      },
      error => {
        alert(error);
      }
    );
  }

  getLatLngFromAddress(address){
    Geocoder.getFromLocation(address).then(
        json => {
          var location = json.results[0].geometry.location;
           //alert(location.lat + ", " + location.lng);
           let myPosition = {
             latitude: location.lat,
             longitude: location.lng,
           };

           if (this.state.isDestinationSelected)
           {
             this.setState({destinationLocation: myPosition,});
             this.findRouteBtwSourceAnDestination();
             this.setState({ calculatingRoute: true });
           }
           else
           {
             this.setState({currentLocation: myPosition,});
             this.setState({region:{latitude:location.lat,longitude:location.lng,latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421}});
           }

        },
        error => {
          alert(error);
        }
      );
  }

  onChangeLocation(text) {
    this.setState({ myLocationAddress: text });
    const location = text.split(",");
    if ((location === null) || (location.length !== 2)) {
      return;
    }
    let myPosition = {
      latitude: Number(location[0]),
      longitude: Number(location[1]),
    };

    this.setState({
      currentLocation: myPosition,
    });
  }

  onChangeDesination(text) {
    this.setState({ destinationAddress: text });
  }

  onSendRequest() {
    this.popupDialog.show();
  }

  approveRequestPopup(){
     this.fetchRiderPaysContract(this.state.routeCostToken);
     this.setState({loaderVisible:true});
  }
  declineRequestPopup(){
    this.popupDialog.dismiss();
    this.setState({routePolylines: []});
    this.setState({ isCalculatedResult: false });
    this.setState({ calculatingRoute: false });
    this.setState({isDestinationRouteDraw:false});
      this.setState({destinationAddress:'My Destination Address'})

  }

  onRegionChange(region) {
    this.setState({ region });
  }

  get renderBottomContent() {
   if (this.state.isCalculatedResult && !this.state.isDriverApp) {
      return (
        <View style={ commuterzstyles.bottomSendRequestContainer }>
          <View style={ commuterzstyles.userPrizeContainer }>
            <Text style={ commuterzstyles.textCostOfRide }>Cost Of Ride: </Text>
            <Image source={ tokenIcon } style={ commuterzstyles.imageToken }/>
            <Text style={ commuterzstyles.textCostOfRideValue }>{this.state.routeCostToken}</Text>
          </View>
          <TouchableOpacity activeOpacity={ .5 } onPress={ () => this.onSendRequest() }>
            <View style={ commuterzstyles.buttonWrapper }>
              <Text style={ commuterzstyles.textButton }>Send Request</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
  else if(this.state.isDriverApp && this.state.driverRideRequest)
    {
      return (

      <View style={ commuterzstyles.driverBottomRequestContainer }>
        <View style={commuterzstyles.driverPickupRequestView }>
              <Text style={ commuterzstyles.driverTextPickUp }>You Have a Ride Request! </Text>
                <View style={{flexDirection:'column' ,flex:1, marginTop:5}}>
                    <View style={{flexDirection:'row',flex:1,justifyContent:'center',}}>
                        <View style={ commuterzstyles.driverAvatarWrapper }>
                          <Image source={ ovalIcon } style={ commuterzstyles.driverImageAvatar }/>
                        </View>
                         <View>
                            <View style={{flexDirection:'row',flex:1,justifyContent:'flex-start', marginLeft:5}}>
                                <Text style={commuterzstyles.driverNameTest} > {this.state.riderName} </Text>
                            </View>
                            <View style={{flexDirection:'row',flex:1,justifyContent:'flex-start', marginTop:-5,marginLeft:5}}>
                                <Text style={commuterzstyles.driverRidePriceText} > Price of Ride: </Text>
                                <Image source={ tokenIcon } style={ commuterzstyles.driveImageToken }/>
                                <Text style={commuterzstyles.driverRideTokenAmount} > {this.state.driverRideRequestCost} </Text>
                            </View>
                         </View>
                    </View>
                 </View>
         </View>

        <View style={{flexDirection:'column' ,flex:1, height:130}}>
             <View style={{flexDirection:'row' , backgroundColor:'#FFF',height:65,justifyContent:'center',alignItems:'center'}}>
                <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                  <Image source={ driverLocation } style={ commuterzstyles.driveImageToken }/>
                    <Text  numberOfLines={2} style={{width:100,fontFamily: 'Exo-Medium', fontSize:14, color:'#9b9b9b',marginLeft:10}} >{this.state.driverPickUpSourceAddress}</Text>
                  </View>
                <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                  <Image source={ destinationIconDriver } style={ commuterzstyles.driveImageToken }/>
                  <Text  numberOfLines={2}  style={{width:100,fontFamily: 'Exo-Medium', fontSize:14, color:'#9b9b9b',marginLeft:10}} >{this.state.driverPickUpDestinationAddress} </Text>
             </View>
             </View>
             <View style={{flexDirection:'row' , backgroundColor:'#FFF',height:65,justifyContent:'center',alignItems:'center'}}>
              <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                 <Image source={ clockIcon } style={ commuterzstyles.driveImageToken }/>
               <Text style={{width:100,fontFamily: 'Exo-Medium',  fontSize:20,color:'#9b9b9b',marginLeft:10}} >{this.state.driverPickUpTime} </Text>
               </View>
                 <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
               <Image source={ pathIcon } style={ commuterzstyles.driveImageToken }/>
                 <Text style={{width:100,fontFamily: 'Exo-Medium',  fontSize:20,color:'#9b9b9b',marginLeft:10}} >{this.state.driverPickUpDistance} </Text>
                 </View>
        </View>
        </View>

        <View style={{flexDirection:'row', justifyContent:'center',height:50,bottom:0}}>
             <View style ={commuterzstyles.driverAcceptRideBtn}>
                  <TouchableOpacity  onPress={this.acceptRideRequest.bind(this)} >
                      <Text style={{fontFamily: 'Exo-Medium',  textAlign:'center',color:'#fff',fontSize: 20,}} > Accept Ride </Text>
                  </TouchableOpacity>
                </View>
                <View style ={commuterzstyles.driverDeclineRideBtn}>
                   <TouchableOpacity  onPress={this.declineRideRequest.bind(this)} >
                       <Text style={{fontFamily: 'Exo-Medium',  textAlign:'center',color:'#fff',fontSize: 20,}} > Decline Ride </Text>
                   </TouchableOpacity>
              </View>
        </View>
      </View>

    );
  }else if(!this.state.isDriverApp && !this.state.isDriverApprovedRide) {
      return (
        <View style={ commuterzstyles.bottomGoContainer }>
          <View style={ commuterzstyles.inputTextContainer }>
            <View style={ commuterzstyles.imageWrapper }>
              <Image source={ searchIcon } style={ commuterzstyles.imageSearch }/>
            </View>
            <TouchableOpacity activeOpacity={ .5 } style={{alignItems: 'center',justifyContent: 'center',}}
            onPress={() => {  this.setState({modalVisible: true,isDestinationSelected:false})}}>
              <Text style={ commuterzstyles.locationAddress} numberOfLines={1}>{ this.state.myLocationAddress } </Text>
            </TouchableOpacity>
          </View>
          <View style={ commuterzstyles.line }/>
          <View style={ commuterzstyles.inputTextContainer }>
            <View style={ commuterzstyles.imageWrapper }>
              <Image source={ destinationIcon } style={ commuterzstyles.imageDesination }/>
            </View>
            <TouchableOpacity activeOpacity={ .5 } style={{alignItems: 'center',justifyContent: 'center',}}
            onPress={() => {  this.setState({modalVisible: true, isDestinationSelected:true})}}>
              <Text style={ commuterzstyles.locationAddress} numberOfLines={1}>{ this.state.destinationAddress } </Text>
            </TouchableOpacity>

          </View>
          <TouchableOpacity activeOpacity={ .5 } onPress={ () => this.onGo() }>
            <View style={ commuterzstyles.buttonWrapper }>
              <Text style={ commuterzstyles.textButton }>GO!</Text>
              <Image source={ rabbitIcon } style={ commuterzstyles.imageRabbit }/>
            </View>
          </TouchableOpacity>
        </View>


      );
  }else if(!this.state.isDriverApp && this.state.isDriverApprovedRide){
    return(
      <View style={commuterzstyles.driverRideApprovedRectangle}>
      <View style={{flexDirection:'column' , height:40}}>
        <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
         <Text  numberOfLines={1}  style={commuterzstyles.rideApproveTimePickUp}>Time to Pickup </Text>
          <Text  numberOfLines={1}  style={commuterzstyles.rideApproveTimePickUp}>Distance to Pickup </Text>
        </View>
        </View>
        <View style={{flexDirection:'column', height:63}}>
        <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
            <View style={commuterzstyles.rideViewRectangle}>
            <Text  numberOfLines={1}  style={commuterzstyles.rideApproveTextTimeDistance}>16.0</Text>
            <Text  numberOfLines={1}  style={commuterzstyles.rideApproveTextMinMiles}>min</Text>
            </View>
            <View style={commuterzstyles.rideViewRectangleRight}>
            <Text  numberOfLines={1}  style={commuterzstyles.rideApproveTextTimeDistance}>16.0</Text>
            <Text  numberOfLines={1}  style={commuterzstyles.rideApproveTextMinMiles}>miles</Text>
            </View>
        </View>
          </View>
      </View>
    );
  }

 }

  get renderDestinationMapMarker() {
     if (this.state.isCalculatedResult) {
       return (
         <MapView.Marker
           coordinate={ this.state.destinationLocation }
           flat={ true }
           calloutOffset={{ x: -6, y: 15 }}
           calloutAnchor={{ x: -6, y: 15 }}
         >
          <Image source={ destinationLocationIcon } style={ commuterzstyles.imageDestinationLocationMarker }/>
           <MapView.Callout tooltip>
             <View style={ commuterzstyles.destionationCallout }>
               <Text style={ commuterzstyles.textAddress }>35 Anza Street, San Francisco</Text>
               <Text style={ commuterzstyles.textDistance }>0.6 km</Text>
             </View>
             <View style={ commuterzstyles.arrow }/>
           </MapView.Callout>
         </MapView.Marker>
       );
     }

     return null;
   }


  get renderMyLocationMapMarker() {
    //alert("renderMyLocationMapMarker" + JSON.stringify(this.state.currentLocation ) )
    if (this.state.currentLocation === null) {
      return null;
    }

    return (
      <MapView.Marker draggable
        coordinate={ this.state.currentLocation }
        flat={ true }
         anchor={ANCHOR}
         onDragEnd={(e) => {
          this.getAddressFromLatLng(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude);
          this.setState({
            currentLocation: e.nativeEvent.coordinate,
          })}
        }
      >
        <Image source={ currentLocationIcon } style={ commuterzstyles.imageMyLocationMarker }>
          <View style={ commuterzstyles.locationAvatarWrapper }>
            <Image source={ ovalIcon } style={ commuterzstyles.imageLocationAvatar }/>
          </View>
        </Image>
      </MapView.Marker>
    );
  }

  get renderCustomerLocationMarker()
  {
      return (
        <MapView.Marker
          coordinate={ this.state.customerLocation }
          flat={ true }
          calloutOffset={{ x: -6, y: 15 }}
          calloutAnchor={{ x: -6, y: 15 }}
        >
         <Image source={ destinationLocationIcon } style={ commuterzstyles.imageDestinationLocationMarker }/>
          <MapView.Callout tooltip>
            <View style={ commuterzstyles.destionationCallout }>
              <Text style={ commuterzstyles.textAddress }>35 Anza Street, San Francisco</Text>
              <Text style={ commuterzstyles.textDistance }>0.6 km</Text>
            </View>
            <View style={ commuterzstyles.arrow }/>
          </MapView.Callout>
        </MapView.Marker>
      );
  }


  get renderMyLocationButton() {
    if (!this.state.isCalculatedResult && !this.state.isDriverApprovedRide) {
    return (
      <TouchableOpacity activeOpacity={ .5 } style={ commuterzstyles.buttonMyLocation } onPress={ () => this.onMoveMyLocation() }>
        <Image source={ focusLocationIcon } style={ commuterzstyles.imageFocusLocation }/>
      </TouchableOpacity>
    );
  }else if(this.state.isDriverApprovedRide){
    return(
      <TouchableOpacity activeOpacity={ .5 } style={ commuterzstyles.buttonMyLocation }>
        <Image source={ callIcon } style={ commuterzstyles.imageFocusLocation }/>
      </TouchableOpacity>
    );
  }
  }

  render() {
    return (
      <View style={ commuterzstyles.container }>
        <Spinner overlayColor={ "rgba(0, 0, 0, 0.75)" } visible={ this.state.calculatingRoute }>
          <View style={ commuterzstyles.calculatingRouteContainer }>
            <Image source={ calculatingRouteIcon } style={ commuterzstyles.imageCalculatingRoute }/>
          </View>
        </Spinner>

        <View style={ commuterzstyles.topBar }>

          <View style={ commuterzstyles.topBarContentWrapper }>
            <TouchableOpacity activeOpacity={ .5 } onPress={ () => this.onMenu() }>
              <View style={ commuterzstyles.buttonMenuWrapper }>
                <Image source={ menuIcon } style={ commuterzstyles.imageMenu }/>
              </View>
            </TouchableOpacity>
            <View style={ commuterzstyles.userInfoContainer }>
              <View style={ commuterzstyles.userPrizeContainer }>
                <Image source={ tokenIcon } style={ commuterzstyles.imageToken }/>
                <Text style={ commuterzstyles.textToken }>{this.state.tokenBalance}</Text>
              </View>
              <TouchableOpacity activeOpacity={ .5 } onPress={ () => this.onShop() } style={ commuterzstyles.shopContainer }>
                <Text style={ commuterzstyles.textShop }>Shop</Text>
              </TouchableOpacity>
              <View style={ commuterzstyles.avatarWrapper }>
                <Image source={ ovalIcon } style={ commuterzstyles.imageAvatar }/>
              </View>
            </View>
          </View>

        </View>

        <View style={ commuterzstyles.topContainer }>
          <View style={ commuterzstyles.topCellContainer }>
            <Text style={ commuterzstyles.textFieldName }>Current Prize</Text>
            <View style={ commuterzstyles.fieldNameContainer }>
              <Image source={ tokenIcon } style={ commuterzstyles.imageToken }/>
              <Text style={ commuterzstyles.textCurrentPrize }>3000</Text>
            </View>
          </View>
          <View style={ commuterzstyles.topPaddingContainer }/>
          <View style={ commuterzstyles.topCellContainer }>
            <Text style={ commuterzstyles.textFieldName }>Time To Raffle</Text>
            <View style={ [commuterzstyles.fieldNameContainer, { justifyContent: 'space-around' }] }>
              <View style={ commuterzstyles.timeFieldContainer }>
                <Text style={ commuterzstyles.textTimeValue }>{this.state.TimeToRaffleHours}</Text>
                <Text style={ commuterzstyles.textTimeLabel }>HRS</Text>
              </View>
              <View>
                <Text style={ commuterzstyles.textTimeValue }>:</Text>
                <Text style={ commuterzstyles.textTimeLabel }></Text>
              </View>
              <View style={ commuterzstyles.timeFieldContainer }>
                <Text style={ commuterzstyles.textTimeValue }>{this.state.TimeToRaffleMinutes}</Text>
                <Text style={ commuterzstyles.textTimeLabel }>MNS</Text>
              </View>
              <View>
                <Text style={ commuterzstyles.textTimeValue }>:</Text>
                <Text style={ commuterzstyles.textTimeLabel }></Text>
              </View>
              <View style={ commuterzstyles.timeFieldContainer }>
                <Text style={ commuterzstyles.textTimeValue }>{this.state.TimeToRaffleSeconds}</Text>
                <Text style={ commuterzstyles.textTimeLabel }>SEC</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={ commuterzstyles.mapWrapper }>
          <MapView ref='map' key={'map'} style={ commuterzstyles.map }
            showsCompass={true}
            defaultZoom={25}
            region={this.state.region}
            onRegionChange={this.onRegionChange.bind(this)}
            >

           {!this.state.isDriverApp &&
            <MapView.Marker
                title='Your location'
                coordinate={ this.state.currentLocation }
                pinColor='#4595fa'
              />
            }
            {this.state.isDestinationRouteDraw &&
              <MapView.Marker
                  title= { this.state.destinationAddress }
                   coordinate={ this.state.destinationLocation }
                  pinColor='orange'
                />
            }

            <MapView.Polyline coordinates={[ ...this.state.routePolylines,]}
                      strokeWidth={4}
                      strokeColor="orange"
                      fillColor="rgba(255,0,0,0.5)"
              />

            {this.state.driverRideRequest &&
                <MapView.Polyline coordinates={[ ...this.state.riderRequestPolyline,]}
                          strokeWidth={4}
                          strokeColor="orange"
                          fillColor="rgba(255,0,0,0.5)"
                    />
              }
            { this.state.driverRideRequest && this.state.driverPickUpDestination !='' &&
              <MapView.Marker
                      title= { this.state.driverPickUpDestinationAddress }
                      coordinate={ this.state.driverPickUpDestination }
                      pinColor='orange'
                />
              }
            { this.state.driverRideRequest && this.state.driverPickUpSource !='' &&
                <MapView.Marker
                        title= { this.state.driverPickUpSourceAddress }
                        coordinate={ this.state.driverPickUpSource }
                        pinColor='#4595fa'
                  />
              }
             { this.state.driverCurrentLocation !='' && this.state.isDriverApp &&
                <MapView.Marker
                        title= 'Your Location'
                        coordinate={ this.state.driverCurrentLocation }
                        image={carIcon}
                />
              }
        </MapView>

          { this.renderMyLocationButton }
        </View>
      { this.renderBottomContent }

       <Modal visible={this.state.modalVisible} onRequestClose={() => {this.setState({modalVisible:false })}}>
         <AutoCompleteAddressModel onSelect = {(value) => {
           if (this.state.isDestinationSelected)
           {
               this.getLatLngFromAddress(value)
              this.setState({ destinationAddress: value, modalVisible:false });
           }
           else
           {
                this.getLatLngFromAddress(value)
               this.setState({ myLocationAddress: value, modalVisible:false });
           }
        }}
        onCancel ={()=>{
                 this.setState({modalVisible:false });
               }}
        />
       </Modal>

       <PopupDialog
           ref={(popupDialog) => { this.popupDialog = popupDialog; }}
           closeOnTouchOutside={false} haveOverlay={true} closeOnHardwareBackPress={false} width="90%" height="45%">
           <View style={{flex: 1,flexDirection: 'column',}}>
               <View style={{alignItems:'center'}}>
               <Text style={commuterzstyles.textSendRequestTitle}>Permission</Text>
               </View>

          <View style={{  backgroundColor:'#4595fa',marginTop: 5, height:1.5,marginLeft:18,marginRight:18}}></View>

            <Text style={commuterzstyles.textSendRequestOne}>By sending request you approve </Text>
            <View style={{flexDirection:'row' ,flex:1,justifyContent:'center',}}>
             <Text style={ commuterzstyles.textSendRequestTwo }>of sending </Text>
              <Image source={ tokenIcon } style={{  width: 22,height: 22, marginTop:6, marginRight:3} }/>
              <Text style={ commuterzstyles.textSendRequestTwo }>{this.state.routeCostToken} to Escrow.</Text>
            </View>

            <View style={{alignItems:'center',flexDirection: 'column', marginTop:-8,}}>
            <Text style={commuterzstyles.textSendRequestApprove}>By Approving you agree to our</Text>
             <Text style={commuterzstyles.textSendRequestTerms}>Terms and Conditions</Text>
            </View>

           <View style={{flexDirection:'row' ,flex:1,justifyContent:'center', marginTop:20}}>
            <View style ={commuterzstyles.buttonSendRequestApprove}>
               <TouchableOpacity  onPress={this.approveRequestPopup.bind(this)} >
                   <Text style={commuterzstyles.popUpButtonText} > Approve </Text>
               </TouchableOpacity>
             </View>

             <View style ={commuterzstyles.buttonSendRequestDecline}>
                <TouchableOpacity  onPress={this.declineRequestPopup.bind(this)} >
                    <Text style={commuterzstyles.popUpButtonText} > Decline </Text>
                </TouchableOpacity>
              </View>

            </View>

          </View>
       </PopupDialog>


       <PopupDialog
           ref={(driverPopupDialog) => { this.driverPopupDialog = driverPopupDialog; }}
           closeOnTouchOutside={false} haveOverlay={true} closeOnHardwareBackPress={false} width="90%" height="45%">
           <View style={{flex: 1,flexDirection: 'column',}}>
               <View style={{alignItems:'center'}}>
               <Text style={commuterzstyles.textSendRequestTitle}>Permission</Text>
               </View>

          <View style={{  backgroundColor:'#4595fa',marginTop: 5, height:1.5,marginLeft:18,marginRight:18}}></View>

            <Text style={commuterzstyles.textSendRequestOne}>By sending request you approve </Text>
            <View style={{flexDirection:'row' ,flex:1,justifyContent:'center',}}>
             <Text style={ commuterzstyles.textSendRequestTwo }>of sending </Text>
              <Image source={ tokenIcon } style={{  width: 22,height: 22, marginTop:6, marginRight:3} }/>
              <Text style={ commuterzstyles.textSendRequestTwo }>{this.state.driverRideRequestCost} to Escrow.</Text>
            </View>

            <View style={{alignItems:'center',flexDirection: 'column', marginTop:-8,}}>
            <Text style={commuterzstyles.textSendRequestApprove}>By Approving you agree to our</Text>
             <Text style={commuterzstyles.textSendRequestTerms}>Terms and Conditions</Text>
            </View>

           <View style={{flexDirection:'row' ,flex:1,justifyContent:'center', marginTop:20}}>
            <View style ={commuterzstyles.buttonSendRequestApprove}>
               <TouchableOpacity  onPress={this.approveRideRequestPopup.bind(this)} >
                   <Text style={commuterzstyles.popUpButtonText} > Approve </Text>
               </TouchableOpacity>
             </View>

             <View style ={commuterzstyles.buttonSendRequestDecline}>
                <TouchableOpacity  onPress={this.declineRideRequestPopup.bind(this)} >
                    <Text style={commuterzstyles.popUpButtonText} > Decline </Text>
                </TouchableOpacity>
              </View>

            </View>

          </View>
       </PopupDialog>

       <Spinner visible={this.state.loaderVisible} />
      </View>

    );
  }

/*******************driver App Requests**************************************/

updateDriverRideRequestData(notif){
  console.warn(JSON.stringify(notif));
  var body = JSON.parse(notif.body);
  var sourceAddress= body.sourceAddress;
  var destinationAddress= body.destinationAddress;
  var riderSourcePoints = body.source;
  var riderDestinationPoints = body.destination;
  var rideDistance = body.rideDistance;
  var routeTime = body.routeTime;
  rideId = body.rideId;
  var rideCost = body.costToken;
  //alert("time" + routeTime);

  this.setState({driverPickUpSource:riderSourcePoints});
  this.setState({driverPickUpDestination:riderDestinationPoints})
  this.setState({driverPickUpSourceAddress:sourceAddress});
  this.setState({driverPickUpDestinationAddress:destinationAddress});
  this.setState({driverRideRequestCost:rideCost});
  this.setState({driverPickUpTime:routeTime});
  this.drawRouteBtwDriverAndRiderLocation();
  rideDistance = parseFloat(Math.round(rideDistance * 100) / 100).toFixed(2) +" miles";
  this.setState({driverPickUpDistance:rideDistance});

}

drawRouteBtwDriverAndRiderLocation(){
  var  routeway=[];
  var driverCurrentLocation = this.state.currentLocation;
  var toLoc =driverCurrentLocation.latitude+"," + driverCurrentLocation.longitude;
  this.setState({driverCurrentLocation:this.state.currentLocation})

  var riderLocation = this.state.driverPickUpSource;
  var riderWayPoint = riderLocation.latitude +"," + riderLocation.longitude;

  var riderDestination = this.state.driverPickUpDestination;
  var fromLoc = riderDestination.latitude+"," + riderDestination.longitude;

  var URL =  routeURL+ toLoc +"&destination="+fromLoc+ "&waypoints=optimize:true|" +riderWayPoint+ "&units=imperial&mode=driving&key="+routeKEY+""
  console.warn('URL  '+URL);
  WebAPIEndPoint.getApi(URL,'GET').then((responseJson) =>
  {
    if(responseJson){
      if (responseJson.routes.length) {
         for(var i=0; i<responseJson.routes.length;i++){
            var routesList = responseJson.routes[i];
             for(var j=0; j<routesList.legs.length; j++){
               var legsList = routesList.legs[j];
               var distanceVal = legsList.distance.value;
               var time = legsList.duration.text;
               var disMiles = distanceVal / 1609.344;
                for(var s =0; s < legsList.steps.length; s++){
                   var stepsList = legsList.steps[s];
                   var polyPoints = stepsList.polyline.points;
                    var points =  this.decodePolyline(polyPoints,1);
                     for(var p =0;p < points.length;p++){
                        routeway.push(points[p]);
                     }
                }
             }
         }
        this.setState({riderRequestPolyline: [...routeway] });
      }
    }else{
      Alert.alert("Alert","Something went wrong geting route directions." + JSON.stringify(responseJson.message))
    }
  })
  .done();
}
/***approve ride request open poup for confirmation @author SynsoftGlobal*/
acceptRideRequest(){
 this.driverPopupDialog.show();
}
/***decline ride request button when any ride request from customer @author SynsoftGlobal*/
declineRideRequest(){
  Alert.alert( 'Alert', 'Are you sure you want to decline request.',
  [
    {text: 'Yes', onPress: () => { this.setState({riderRequestPolyline:[]}); this.setState({driverRideRequest:false});}},
    {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
  ], { cancelable: false });

}

/***approve on popup button ride request and update same to server with rideId @author SynsoftGlobal*/
approveRideRequestPopup(){
  var self= this;
    this.setState({loaderVisible:true});
    DriverApiCalling.driverApproveARide(rideId,function(err,result){
        if(result){
            Alert.alert('Ride Approved','You have approved a ride request.');
            self.closeRiderRequestPopUp();
        }
  });
}

/**Close popup dialog @author SynsoftGlobal**/
closeRiderRequestPopUp()
{

      this.driverPopupDialog.dismiss();
      this.setState({loaderVisible: false});
      this.setState({driverRideRequest:false});
      this.setState({driverApprovedRide:true})
  }


/***popup dialog decline ride request and clear bottom window or ride request @author SynsoftGlobal*/
declineRideRequestPopup(){
       this.driverPopupDialog.dismiss();
       this.setState({driverRideRequest:false});
}

/*******************End driver App Requests**************************************/

calculateTimerValue()
    {
        var timeEnd = new Date();
        var timeStart = new Date();
        timeEnd.setDate(timeStart.getDate() + (3 + 7 - timeStart.getDay()) % 7);
        timeEnd.setHours (23);
        timeEnd.setMinutes (59);
        timeEnd.setSeconds (59);
        // Calculate the difference in milliseconds
        var difference_ms = timeEnd - timeStart;
        //alert(difference_ms);
        //take out milliseconds
        difference_ms = difference_ms/1000;
        var seconds = Math.floor(difference_ms % 60);
        difference_ms = difference_ms/60;
        var minutes = Math.floor(difference_ms % 60);
        difference_ms = difference_ms/60;
        var hours = Math.floor(difference_ms);
        //var days = Math.floor(difference_ms/24);
        this.setState({
          TimeToRaffleHours : hours.toString(),
          TimeToRaffleMinutes : minutes.toString(),
          TimeToRaffleSeconds : seconds.toString(),
        });
    }

   StartRaffleTimer()
    {
      // Start a timer that runs continuous after X milliseconds
      const intervalId = BackgroundTimer.setInterval(() => {
          // this will be executed every 200 ms
          // even when app is the the background
          this.calculateTimerValue();
      }, 1000);
    }


  }
export default connect(state => ({
    status: state.home.status,
  }),
  (dispatch) => ({
    actions: bindActionCreators(homeActions, dispatch),
  })
) (Home);
