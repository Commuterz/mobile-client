'use strict';

import React, {Component} from 'react';
import {StyleSheet,Text,View,Image,TextInput,Keyboard,Alert,WebView,Dimensions,TouchableHighlight,TouchableOpacity,StatusBar,Platform,
  PermissionsAndroid,Modal,AsyncStorage,NetInfo} from 'react-native';
import styles from './styles'
import BackgroundImage from '@Components/BackgroundImage'
import { Actions, Scene } from 'react-native-router-flux'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Spinner from 'react-native-loading-spinner-overlay';
import Geocoder from 'react-native-geocoding';
import PopupDialog from 'react-native-popup-dialog';
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';
import Rating from 'react-native-ratings';

import HomeTopBar from '@Components/HomeTopBar'
import PriceTimer from '@Components/HomePriceTimerRow'
import GeocodeCall from './geocode'
import routeCall from './routeCall'
import api from '@API/api';
import riderApiCall from '@API/riderApiCall';
import driverApiCall from '@API/driverApiCall';
import webAPICall from '@API/webAPICall'
import loginUserApiCall from '@API/loginUserApiCall'
import AutoCompleteAddressModel from '@Components/AutoCompleteAddressModal'
import RiderNotified from '@Components/RiderNotified'
import commonUtility from '@lib/commonUtility.js'
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';
import {getProfileData} from '@lib/constants'
// check location is enable only for android
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import BackgroundTimer from 'react-native-background-timer';
import Stars from 'react-native-stars-rating';
var _MaterialIcons=require('react-native-vector-icons/MaterialIcons');
//for ios location
var { DeviceEventEmitter } = React;
var { RNLocation: Location } = require('NativeModules');

var BigNumber = require('bignumber.js');

const { width: screenWidth, height: screenHiehgt } = Dimensions.get('window');

const ASPECT_RATIO = screenWidth / screenHiehgt;
const ANCHOR = { x: 0.5, y: 0.5 };
const LATITUDE = 31.0461;
const LONGITUDE = 34.8516;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

Geocoder.setApiKey('AIzaSyAZKNjTsWG_xTocHqtqRG5zClro6mR15Qk'); // use a  API key

const routeURL='https://maps.googleapis.com/maps/api/directions/json?origin=';
const routeKEY='AIzaSyAZKNjTsWG_xTocHqtqRG5zClro6mR15Qk';
const riderURL = "http://52.170.217.85:3000/riderequest";
const driverPushURL = "http://52.170.217.85:3000/driverrequest"
const initialDistance =0;
let tokenBalanceValue = 0;
var tokenResult = false;
var _mapView: MapView;
var userPic = 'https://addons.cdn.mozilla.net/static//img/zamboni/anon_user.png';
var refreshIntervalId=null;
var rideStartLocationInterval = null;
var typeToLoad ='';
let html = '<div id="myContent">This is my name</div>';
export default class Home extends Component
{
  constructor(props) {
    super(props);
    let myPosition = {
      latitude: LATITUDE,
      longitude: LONGITUDE,
    };
    let destinationPosition = {
      latitude: LATITUDE,
      longitude: LONGITUDE,
    };
    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
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
      tokenBalance:tokenBalanceValue,
      loaderVisible: false,
      deviceToken:'',
      loginUserName:'',
      riderRequestPolyline:[],

      rideId:'',
      userEthereumAddress :'',
      userPrivateKey:'',
      userProfileIPFS:'',
      rateDriverPopup:false,
      rateRiderPopup:false,
      ratingStarValue:0,
      isRiderApp:false, //ride request by same user
      isDriverApp: false,
      riderFullName:'',
      riderProfilePic:'',
      driverFullName:'',
      driverCallNumber:'1234567890',
      driverProfilePic:userPic,
      driverCurrentLocation:'',
      driverRideRequestCost:0,
      driverPickUpSource:'',
      driverPickUpDestination:'',
      driverPickUpSourceAddress:'',
      driverPickUpDestinationAddress:'',
      driverPickUpTime:'0',
      driverPickUpDistance:'',
      driverRideRequest:false,
      isDriverApprovedRide:false,
      timeToPickUpByDriver:0,
      distanceToPickByDriver:0,
      openRideRequestPopup:false,
      timeValueInText:'mins',
      riderNotified:false,
      isRideStarted:false,
      rideIdGetByDriver:'',
      riderDeviceToken:'',
      loginUserData:'',
      loginName:'',
      loginFBID : '',
      loginProfilePic:userPic,
      driverCarName :'Red Toyota',
      driverCarPlateNumber:'012345',
      riderWaitingForPickUp:false,
      rideStartAndPickedUp:false,
      rideStartRoutePolyline:[],
      driverLastCurrentLocation :'',
      searchingForDriver:false,

      riderTimeToDestination:0,
      riderDistanceRemained:0,

    };
}

componentDidMount() {
   AsyncStorage.getItem("userPrivateKey", (errs,result) => {
        if (!errs) {
            if (result !== null) {
                this.setState({userPrivateKey:result});
            }
         }
    })
    AsyncStorage.getItem("userEthereumAddress", (errs,result) => {
         if (!errs) {
             if (result !== null) {
                 this.setState({userEthereumAddress:result});
             }
          }
     });
     if (Platform.OS === 'android') {
        this.checkAndroidDeviceLocationEnabled();
     } else {
        this.onMoveMyLocation();
     }
  this.fcmTokenAndNotificationHandling();
 }
/*************************Location******************************************************/
checkAndroidDeviceLocationEnabled(){
  LocationServicesDialogBox.checkLocationServicesIsEnabled({
            message: "<h2>Use Location </h2>Commuterz app request you to enable location.",
             ok: "Enable",
             cancel: "Not Now"
         }).then(function(success) {
             this.checkPermissionAndroid();
            }.bind(this)
        ).catch((error) => {
             Alert.alert('Alert',"Please enable location.");
         });
}

checkPermissionAndroid(){
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
    .then(granted => {
      if (granted){
        navigator.geolocation.getCurrentPosition((position) => {
                 //let initialPosition = JSON.stringify(position);
                 let myPosition = {latitude: position.coords.latitude,longitude: position.coords.longitude,};
                 this.setState({currentLocation: myPosition, myLocationAddress: position.coords.latitude.toString()+ ' ,' + position.coords.longitude.toString()});
                 this.setState({driverCurrentLocation:myPosition});
                 this.setState({region:{latitude:position.coords.latitude,longitude:position.coords.longitude,
                                latitudeDelta: 0.0922,longitudeDelta: 0.0421}});
                this._addressFromCoordinates(position.coords.latitude,position.coords.longitude);
                this.updateLastLocationOfDriver(myPosition);

        }, error => Alert.alert('Alert','Unable to get your location please try tap on location icon. \n'+ JSON.stringify(error)), { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 });
      }else {
        Alert.alert('Alert','Seems your location is disabled. Allow location from Settings --> App --> Permission')
      }
    });
}

updateLastLocationOfDriver(myPosition){
  AsyncStorage.getItem("lastLocation", (errs,result) => {
       if (!errs) {
           if (result !== null) {
             var data = JSON.parse(result);
             var lastLat = data.latitude;
             var lastlon = data.longitude;
             commonUtility.getDistanceFromLatLonInKm(lastLat,lastlon,
               myPosition.latitude,myPosition.longitude,function(distance){
               if(distance >= 1){
                  AsyncStorage.setItem("currentLocation",JSON.stringify(myPosition));
                  AsyncStorage.setItem("driverCurrentLocation",JSON.stringify(myPosition));
                  AsyncStorage.setItem("lastLocation",JSON.stringify(myPosition));
               }
             });
           }else{
             AsyncStorage.setItem("lastLocation",JSON.stringify(myPosition));
           }
        }
   });
}

onMoveMyLocation() {
  navigator.geolocation.getCurrentPosition( (position) => {
      let myPosition = {latitude: position.coords.latitude,longitude: position.coords.longitude,};
      this.setState({currentLocation: myPosition, myLocationAddress: position.coords.latitude.toString()+ ' ,' + position.coords.longitude.toString()});
      this.setState({driverCurrentLocation:myPosition});
      this.setState({region:{latitude:position.coords.latitude,longitude:position.coords.longitude,
                     latitudeDelta: 0.0922,longitudeDelta: 0.0421}});
     this._addressFromCoordinates(position.coords.latitude,position.coords.longitude);
     this.updateLastLocationOfDriver(myPosition);
    },
    (error) => Alert.alert('Alert',"Unable to get your location."),
    { enableHighAccuracy: false, timeout: 30000, maximumAge: 1000 }
  );

   this.watchID = navigator.geolocation.watchPosition((position) =>
   {
      var lastPosition = JSON.stringify(position);
      let myPosition = {latitude: position.coords.latitude,longitude: position.coords.longitude,};
      this.setState({currentLocation: myPosition,myLocationAddress: position.coords.latitude.toString()+ ' ,' + position.coords.longitude.toString(),});
      this.setState({driverCurrentLocation:myPosition});
      this.setState({region:{latitude:position.coords.latitude,longitude:position.coords.longitude,latitudeDelta: 0.0922,
             longitudeDelta: 0.0421}});
     this.updateLastLocationOfDriver(myPosition);
     this._addressFromCoordinates(position.coords.latitude,position.coords.longitude);
    });
}

/**Getting Address from latitude and longitude @author SynsoftGlobal******/
_addressFromCoordinates(lat,lng){
   GeocodeCall.getAddressFromLatLng(lat,lng).then((json) =>
    {
     if(json){
       var address_component = json.results[0].address_components[0];
       var address = address_component.long_name;
       var formatedAddress = json.results[0].formatted_address;
       var placeId = json.results[0].place_id;
       this.setState({myLocationAddress:formatedAddress});
       AsyncStorage.setItem("myLocationAddress",formatedAddress);

      }
   }).done();
}

/**Getting latitude and longitude from Address @author SynsoftGlobal******/

_coordinatesFromAddress(address){
 GeocodeCall.getLatLngFromAddress(address).then((json) =>
  {
   if(json){
       var location = json.results[0].geometry.location;
       let myPosition = {latitude: location.lat,longitude: location.lng,};
       if (this.state.isDestinationSelected){
         this.setState({destinationLocation: myPosition,});
         this._getRiderRoute();
         this.setState({ calculatingRoute: true });
           AsyncStorage.setItem("destinationLocation",myPosition);
       }else{
         this.setState({currentLocation: myPosition,});
         this.setState({region:{latitude:location.lat,longitude:location.lng,latitudeDelta: 0.0922,
                longitudeDelta: 0.0421}});
        AsyncStorage.setItem("currentLocation",myPosition);
       }
    }
 }).done();
}

onChangeLocation(text) {
 navigator.geolocation.getCurrentPosition((position) => {
           var initialPosition = JSON.stringify(position.coords);
           this.setState({position: initialPosition});
           let tempCoords = {
               latitude: Number(position.coords.latitude),
               longitude: Number(position.coords.longitude)
           }
           let myPosition = {latitude: position.coords.latitude,longitude: position.coords.longitude,};
           this.setState({currentLocation: myPosition, myLocationAddress: position.coords.latitude.toString()+ ' ,' + position.coords.longitude.toString()});
           this.setState({driverCurrentLocation:myPosition});
           this.setState({region:{latitude:position.coords.latitude,longitude:position.coords.longitude,
                          latitudeDelta: 0.0922,longitudeDelta: 0.0421}});
          this._addressFromCoordinates(position.coords.latitude,position.coords.longitude);
           this._map.animateToCoordinate(tempCoords, 1);
         }, function (error) { alert(error) },
    );
}

onChangeDesination(text) {
 this.setState({ destinationAddress: text });
}
/*************************Location******************************************************/
componentWillMount(){
    this.checkCurrentScreenActiveToLoad();
  NetInfo.isConnected.fetch().then(isConnected => {
     console.log('First, is ' + (isConnected ? 'online' : 'offline'));
     if(isConnected){
       this.setState({loaderVisible:true});
      this.fetchUserBalanceDispatcher();
      this.fetchUserProfileData();
     }else{
       Alert.alert('Alert','No internet connections found. Please connect and try again.')
     }
  });
 }

/*************Managing State to Load conditions views****************************/
checkCurrentScreenActiveToLoad(){
  var self = this;
  AsyncStorage.getItem("type", (errs,result) => {
       if (!errs) {
           if (result !== null) {
              typeToLoad = result;
              if(result === 'isRider'){
                //alert('isRider');
                //self.checkRiderFlow();
              }else if(result === 'isDriver'){
                  //alert('isDriver');
                //self.checkDriverFlow();
              }
           }
        }
   })
}
checkDriverFlow(){
  var self = this;
  AsyncStorage.getItem("driver", (errs,result) => {
    if(!errs){
      if(result !== null){
        if(result === 'ride_request'){

        }else if(result === 'approve_ride'){

        }else if(result === 'ride_start'){

        }else if(result === 'ride_end_rate'){
            this.showRateViewForDriver();
        }
      }
    }
  });
}
checkRiderFlow(){
  var self = this;
  AsyncStorage.getItem("rider", (errs,result) => {
       if (!errs) {
           if (result !== null) {
              if(result === 'go' || result === 'send_request_dialog'){
                //alert('go.. or send_request_dialog...');
              }else if(result === 'ride_request_for_driver'){
                //alert(' ride_request_for_driver...');
                // self.closeRideRequestPopUp();
              }else if(result === 'ride_accept_by_driver'){
                  console.warn('ride_accept_by_driver...');
                  self.rideAcceptViewToRider('');
              }else if(result === 'ride_approved_driver'){
                console.warn('ride_approved_driver')
                rideApprovedByDriver();
              }else if(result === 'ride_start'){
                console.warn('ride_start...');
                 self.rideStartAtRiderSide('');
              }else if(result === 'rate_driver'){
                console.warn('rate_driver...');
                self.setState({riderWaitingForPickUp:false});
                self.setState({searchingForDriver:false});
                self.setState({rideStartAndPickedUp:false});
                self.setState({rateRiderPopup:true});
              }
           }
        }
   });
}

 /***getting balance of User**/
fetchUserBalanceDispatcher(){
  // Start a timer that runs continuous after X milliseconds
const intervalId = BackgroundTimer.setInterval(() => {
    // this will be executed every 5 seconds
    // even when app is the the background
    var selfBalance = this;
    AsyncStorage.getItem("userEthereumAddress", (errs,ethAddress) => {
         if (!errs) {
             if (ethAddress !== null) {
               loginUserApiCall.loginUserBalance(ethAddress ,function(err,result){
                 if(result){
                   //console.warn('result' + result);
                   selfBalance.setState({tokenBalance:result.toString(10)})
                   selfBalance.setState({loaderVisible:false});
                 }else{
                   console.log("Error" +err);
                 }
               });
            }
          }
     })
}, 5000);
}

fetchUserProfileData(){
  var self =this;
  AsyncStorage.getItem("userIpfs",(err,ipfs) => {
    if(!err){
      if(ipfs !=null){
        var jsonData = JSON.stringify({
          hash:ipfs,
        });
        webAPICall.postApiWithJosnDataInMainThread(getProfileData,jsonData,'POST').then((result) =>
         {
          if(result)
            {
                /******{"picture": {"data": {"is_silhouette": true,
                      "url": "https://scontent.xx.fbcdn.net/v/t1.0-1/c15.0.50.50/p50x50/1379841_10150004552801901_469209496895221757_n.jpg?oh=d501be4493d45eab9adf54b6b8953587&oe=59A25233"
                    }},  "name": "Ashley Last Synsoft","id": "100005020412363"}*************/
                  var profilePic = result.picture.data.url;
                  var name =  result.name;
                  var fbID = result.id;
                  self.setState({loginUserData:result});
                  self.setState({loginProfilePic:profilePic});
                  self.setState({loginName:name});
                  self.setState({loginFBID:fbID});
                  self.setState({loaderVisible:false});
              }
          }).done();
      }
    }
  });
  AsyncStorage.getItem("userEthereumAddress", (errs,ethAddress) => {
       if (!errs) {
           if (ethAddress !== null) {
             loginUserApiCall.userProfileDataIPFS(ethAddress,function(err,result){
                 if(result){
                   //console.warn("result" + JSON.stringify(result));
                   self.setState({userProfileIPFS:result})
                 }
             });
          }
        }
   });

}

/************************FCM noitification and token @author SynsoftGlobal***********************************/
fcmTokenAndNotificationHandling(){
     FCM.requestPermissions(); // for iOS
     FCM.getFCMToken().then(token => {
        console.log('Token => '+token)
        this.setState({deviceToken:token})
    });
    FCM.getInitialNotification().then(notif => {
          if(notif == undefined || notif.body == undefined || notif.body == " "){
                 return;
            }
        //Alert.alert('here...1' + notif.body.type);
        this.showLocalNotificationForeground(notif);
    });
   this.notificationListener = FCM.on(FCMEvent.Notification, async (notif) => {
        // there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
    if(notif.local_notification){
        //this is a local notification
        return;
    }
    if(notif.opened_from_tray){
       //Alert.alert('Notifcation' + JSON.stringify(notif));
       this.showLocalNotificationForeground(notif)
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
  if(!this.state.isRiderApp){
    if(notif.type === 'Ride request'){
      Alert.alert( 'Ride Request', 'You have a new ride request.',
        [{text: 'OK', onPress: () => this.updateDriverRideRequestData(notif)}, ],
           { cancelable: false } )
    }
  }else if(notif.type === 'driver_msg'){
      var body = JSON.parse(notif.body);
       if(body.type === 'rideStartByDriver'){
              Alert.alert('Driver Arrived', "Driver arrived to your location.");
              this.setState({riderWaitingForPickUp:false});
              this.setState({searchingForDriver:false});
              this.setState({rideStartAndPickedUp:true});
              AsyncStorage.setItem("rider","ride_start");
             const timeoutId = BackgroundTimer.setTimeout(() => {
              // this will be executed once after 10 seconds
              // even when app is the the background
            	  this.rideStartAtRiderSide(notif);
              }, 10000);
            // Cancel the timeout if necessary
            BackgroundTimer.clearTimeout(timeoutId);

        }else if(body.type === 'rideAcceptByDriver'){
            Alert.alert('Ride Accept', "Your requested ride is accepted");
            this.setState({searchingForDriver:false});
            this.setState({riderWaitingForPickUp:false});
            this.rideAcceptViewToRider(notif);
        }else if(body.type === 'driverEndRide'){
          Alert.alert('Ride End', "Congratulations, you have reached to your destination.");
          this.setState({riderWaitingForPickUp:false});
          this.setState({searchingForDriver:false});
          this.setState({rideStartAndPickedUp:false});
          this.setState({rateRiderPopup:true});
          AsyncStorage.setItem("rider","rate_driver");

        }
    }
    //these clears notification from notification center/tray
    FCM.removeAllDeliveredNotifications()
}

updateDriverRideRequestData(notif){
  //console.warn(JSON.stringify(notif));
  if(notif === ''){
    var self = this;
    AsyncStorage.getItem("riderDeviceToken", (errs,result) => {
      if(!errs){
        if(result!=null){
          var riderDeviceToken = result;
          self.setState({isDriverApp:true})
          self.setState({riderDeviceToken:riderDeviceToken});
        AsyncStorage.setItem("driverPickUpSource", (errs,result) => {
            if(result!=null){
               var driverPickUpSource = result;
                 self.setState({driverPickUpSource:riderSourcePoints});
            }
        });
        AsyncStorage.setItem("driverPickUpDestination",(errs,result) => {
            if(result!=null){
               var riderDestinationPoints = result;
              self.setState({driverPickUpDestination:riderDestinationPoints})
              //draw path with source and destination.
              self.drawRouteBtwDriverAndRiderLocation();
              self.setState({loaderVisible:false});
              AsyncStorage.setItem("driverPickUpDestinationAddress",(errs,result) => {
                  if(result!=null){
                     var destinationAddress = result;
                    self.setState({driverPickUpDestinationAddress:destinationAddress});
                  }
              });
              AsyncStorage.setItem("driverPickUpSourceAddress",(errs,result) => {
                  if(result!=null){
                     var sourceAddress = result;
                    self.setState({driverPickUpSourceAddress:sourceAddress});
                  }
              });
            }
        });
       AsyncStorage.setItem("driverRideRequestCost",(errs,result) => {
            if(result!=null){
               var rideCost = result;
              self.setState({driverRideRequestCost:rideCost});
            }
        });
        AsyncStorage.setItem("driverPickUpTime",(errs,result) => {
            if(result!=null){
               var routeTime = result;
              self.setState({driverPickUpTime:routeTime});
            }
        });
        AsyncStorage.setItem("riderFullName",(errs,result) => {
            if(result!=null){
               var riderName = result;
              self.setState({riderFullName:riderName});
            }
        });
        AsyncStorage.setItem("riderProfilePic",(errs,result) => {
            if(result!=null){
               var riderProfilePic = result;
                self.setState({riderProfilePic:riderProfilePic});
            }
        });
        AsyncStorage.setItem("rideDistance",(errs,result) => {
            if(result!=null){
               var rideDistance = result;
               rideDistance = parseFloat(Math.round(rideDistance * 100) / 100).toFixed(2) +" miles";
               self.setState({driverPickUpDistance:rideDistance});
            }
        });
        AsyncStorage.setItem("rideIdGetByDriver",(errs,result) => {
            if(result!=null){
               var rideId = result;
               self.setState({rideIdGetByDriver:rideId})
            }
         });

        }
      }
    });
  }else{
    //this.setState({loaderVisible:true});
    this.setState({isDriverApp:true})
    this.setState({openRideRequestPopup:true});
    this.setState({driverRideRequest:true});
    this.setState({isCalculatedResult:false})

    var body = JSON.parse(notif.body);
    var sourceAddress= body.sourceAddress;
    var destinationAddress= body.destinationAddress;
    var riderSourcePoints = body.source;
    var riderDestinationPoints = body.destination;
    var rideDistance = body.rideDistance;
    var routeTime = body.routeTime;
    var rideId = body.rideId;
    var rideCost = body.costToken;
    var riderName = body.riderName;
    var riderProfilePic = body.riderProfilePic;
    var riderFBID = body.riderFBId;
    var riderDeviceToken = body.deviceToken;

    this.setState({rideIdGetByDriver:rideId})
    this.setState({riderDeviceToken:riderDeviceToken});
    this.setState({driverPickUpSource:riderSourcePoints});
    this.setState({driverPickUpDestination:riderDestinationPoints})
    this.setState({driverPickUpSourceAddress:sourceAddress});
    this.setState({driverPickUpDestinationAddress:destinationAddress});
    this.setState({driverRideRequestCost:rideCost});
    this.setState({driverPickUpTime:routeTime});
    this.setState({riderFullName:riderName});
    this.setState({riderProfilePic:riderProfilePic});
    rideDistance = parseFloat(Math.round(rideDistance * 100) / 100).toFixed(2) +" miles";
    this.setState({driverPickUpDistance:rideDistance});
    this.drawRouteBtwDriverAndRiderLocation();

    AsyncStorage.setItem("driver","ride_request");
    AsyncStorage.setItem("type","isDriver");
    AsyncStorage.setItem("riderDeviceToken",riderDeviceToken);
    AsyncStorage.setItem("driverPickUpSource",JSON.stringify(riderSourcePoints));
    AsyncStorage.setItem("driverPickUpDestination",JSON.stringify(riderDestinationPoints));
    AsyncStorage.setItem("driverPickUpSourceAddress",sourceAddress);
    AsyncStorage.setItem("driverPickUpDestinationAddress",destinationAddress);
    AsyncStorage.setItem("driverRideRequestCost",rideCost);
    AsyncStorage.setItem("driverPickUpTime",routeTime);
    AsyncStorage.setItem("riderFullName",riderName);
    AsyncStorage.setItem("riderProfilePic",riderProfilePic);
    AsyncStorage.setItem("rideDistance",rideDistance);
    AsyncStorage.setItem("rideIdGetByDriver",rideId);
  }
}
/**State open when swipe and kill***/
rideApprovedByDriver(){
  var self = this;
  AsyncStorage.getItem("driverCarName", (errs,result) => {
         if (!errs) {
             if (result !== null) {
                var carName = result;
                self.setState({driverCarName:carName});
                AsyncStorage.getItem("driverCarPlateNumber", (errs,result) => {
                  if (!errs) {
                      if (result !== null) {
                        var carPlateNumber = result;
                         self.setState({driverCarPlateNumber:carPlateNumber});
                      }
                    }
                });
                AsyncStorage.getItem("driverFullName", (errs,result) => {
                  if (!errs) {
                      if (result !== null) {
                        var driverName = result;
                         self.setState({driverFullName:driverName});
                      }
                    }
                });
                AsyncStorage.getItem("driverCallNumber", (errs,result) => {
                   if (!errs) {
                       if (result !== null) {
                         var phoneNum = result;
                         self.setState({driverCallNumber:phoneNum});
                       }
                     }
                 });
                 AsyncStorage.getItem("driverProfilePic", (errs,result) => {
                    if (!errs) {
                        if (result !== null) {
                          var driverProfilePic = result;
                             self.setState({driverProfilePic:driverProfilePic});
                        }
                      }
                  });
                 AsyncStorage.getItem("riderTimeToDestination", (errs,result) => {
                     if (!errs) {
                         if (result !== null) {
                           var timeToPickUp = result;
                            self.setState({riderTimeToDestination:timeToPickUp});
                         }
                       }
                   });
                 AsyncStorage.getItem("riderDistanceRemained", (errs,result) => {
                      if (!errs) {
                          if (result !== null) {
                            var distanceToPickUp = result;
                               self.setState({riderDistanceRemained:distanceToPickUp});
                          }
                        }
                   });
                 self.setState({riderWaitingForPickUp:true});
                 self.drawRouteBtwDriverAndRiderLocation();
              }
          }
   });
}
rideAcceptViewToRider(notif){
  AsyncStorage.setItem("rider","ride_accept_by_driver");
  if(notif === ''){
    var self = this;
    AsyncStorage.getItem("driverCarName", (errs,result) => {
           if (!errs) {
               if (result !== null) {
                  var carName = result;
                  self.setState({driverCarName:carName});
                  AsyncStorage.getItem("driverCarPlateNumber", (errs,result) => {
                    if (!errs) {
                        if (result !== null) {
                          var carPlateNumber = result;
                           self.setState({driverCarPlateNumber:carPlateNumber});
                        }
                      }
                  });
                  AsyncStorage.getItem("driverFullName", (errs,result) => {
                    if (!errs) {
                        if (result !== null) {
                          var driverName = result;
                           self.setState({driverFullName:driverName});
                        }
                      }
                  });
                  AsyncStorage.getItem("driverCallNumber", (errs,result) => {
                     if (!errs) {
                         if (result !== null) {
                           var phoneNum = result;
                           self.setState({driverCallNumber:phoneNum});
                         }
                       }
                   });
                   AsyncStorage.getItem("driverProfilePic", (errs,result) => {
                      if (!errs) {
                          if (result !== null) {
                            var driverProfilePic = result;
                               self.setState({driverProfilePic:driverProfilePic});
                          }
                        }
                    });
                   AsyncStorage.getItem("riderTimeToDestination", (errs,result) => {
                       if (!errs) {
                           if (result !== null) {
                             var timeToPickUp = result;
                              self.setState({riderTimeToDestination:timeToPickUp});
                           }
                         }
                     });
                   AsyncStorage.getItem("riderDistanceRemained", (errs,result) => {
                        if (!errs) {
                            if (result !== null) {
                              var distanceToPickUp = result;
                                 self.setState({riderDistanceRemained:distanceToPickUp});
                            }
                          }
                     });
                   self.setState({riderWaitingForPickUp:false})
                   self.riderNotifiedDialog.show();

                }
            }
     });
  }else{
      this.riderNotifiedDialog.show();
      var body = JSON.parse(notif.body);
      var driverCurrentLocation = body.source;
      var driverName = body.driverName;
      var driverProfilePic = body.driverProfilePic;
      var driverIPFS =  body.driverIPFS;
      var costToken = body.costToken;
      var timeToPickUp = body.timeToPickUp;
      var distanceToPickUp = body.distanceToPickUp;
      var carName = body.driverCarName;
      var carPlateNumber = body.driverCarPlateNumber;
      var phoneNum = body.driverCallNumber;
      this.setState({riderWaitingForPickUp:false})
      this.setState({driverCarName:carName});
      this.setState({driverCarPlateNumber:carPlateNumber});
      this.setState({driverFullName:driverName});
      this.setState({driverCallNumber:phoneNum});
      this.setState({driverProfilePic:driverProfilePic});
      this.setState({riderTimeToDestination:timeToPickUp});
      this.setState({riderDistanceRemained:distanceToPickUp});

      AsyncStorage.setItem("driverCarName",carName);
      AsyncStorage.setItem("driverCarPlateNumber",driverCarPlateNumber);
      AsyncStorage.setItem("driverFullName",driverFullName);
      AsyncStorage.setItem("driverCallNumber",phoneNum);
      AsyncStorage.setItem("driverProfilePic",driverProfilePic);
      AsyncStorage.setItem("riderTimeToDestination",timeToPickUp);
      AsyncStorage.setItem("riderDistanceRemained",distanceToPickUp);
    }

}

rideStartAtRiderSide(notif){
  console.warn("<< rideStartAtRiderSide")
  AsyncStorage.setItem("rider","ride_start");
  if(notif === ''){
    console.warn("<< rideStartAtRiderSide if")
    var self= this;
    AsyncStorage.getItem("driverCarName", (errs,result) => {
           if (!errs) {
           if (result !== null) {
              var carName = result;
              self.setState({driverCarName:carName});
              AsyncStorage.getItem("driverCarPlateNumber", (errs,result) => {
                if (!errs) {
                    if (result !== null) {
                      var carPlateNumber = result;
                       self.setState({driverCarPlateNumber:carPlateNumber});
                    }
                  }
              });
              AsyncStorage.getItem("driverFullName", (errs,result) => {
                if (!errs) {
                    if (result !== null) {
                      var driverName = result;
                       self.setState({driverFullName:driverName});
                    }
                  }
              });
              AsyncStorage.getItem("driverCallNumber", (errs,result) => {
                 if (!errs) {
                     if (result !== null) {
                       var phoneNum = result;
                       self.setState({driverCallNumber:phoneNum});
                     }
                   }
               });
               AsyncStorage.getItem("driverProfilePic", (errs,result) => {
                  if (!errs) {
                      if (result !== null) {
                        var driverProfilePic = result;
                           self.setState({driverProfilePic:driverProfilePic});
                      }
                    }
                });
               AsyncStorage.getItem("riderTimeToDestination", (errs,result) => {
                   if (!errs) {
                       if (result !== null) {
                         var timeToPickUp = result;
                          self.setState({riderTimeToDestination:timeToPickUp});
                       }
                     }
                 });
               AsyncStorage.getItem("riderDistanceRemained", (errs,result) => {
                    if (!errs) {
                        if (result !== null) {
                          var distanceToPickUp = result;
                             self.setState({riderDistanceRemained:distanceToPickUp});
                        }
                      }
                 });

            }
        }
     });
     AsyncStorage.getItem("driverCurrentLocation", (errs,result) => {
          if (!errs) {
              if (result !== null) {
                  var driverCurrentLocation = result;
                  self.setState({driverCurrentLocation:driverCurrentLocation});
                  self.setState({riderWaitingForPickUp:false})
                  self.riderNotifiedDialog.show();
              }
            }
      });
  }else{
      console.warn("<< rideStartAtRiderSide else")
    var body = JSON.parse(notif.body);
    var driverCurrentLocation = body.source;
    var driverName = body.driverName;
    var driverProfilePic = body.driverProfilePic;
    var driverIPFS =  body.driverIPFS;
    var costToken = body.costToken;
    var timeRemained = body.timeToPickUp;
    var distanceRemained = body.distanceToPickUp;
    var carName = body.driverCarName;
    var carPlateNumber = body.driverCarPlateNumber;
    var phoneNum = body.driverCallNumber;
    this.setState({driverCurrentLocation:driverCurrentLocation});
    this.setState({driverCarName:carName});
    this.setState({driverCarPlateNumber:carPlateNumber});
    this.setState({driverFullName:driverName});
    this.setState({driverCallNumber:phoneNum});
    this.setState({driverProfilePic:driverProfilePic});
    this.setState({riderTimeToDestination:timeRemained});
    this.setState({riderDistanceRemained:distanceRemained});
    AsyncStorage.setItem("driverCurrentLocation",JSON.stringify(driverCurrentLocation));
    AsyncStorage.setItem("driverCarName",carName);
    AsyncStorage.setItem("driverCarPlateNumber",driverCarPlateNumber);
    AsyncStorage.setItem("driverFullName",driverFullName);
    AsyncStorage.setItem("driverCallNumber",phoneNum);
    AsyncStorage.setItem("driverProfilePic",driverProfilePic);
    AsyncStorage.setItem("riderTimeToDestination",timeToPickUp);
    AsyncStorage.setItem("riderDistanceRemained",distanceToPickUp);
    this.drawRouteForRideStart();
  }

}
/****************************End of Notification Part*********************************************************/

/*******************************Rider Side Components Code*****************************************/

drawRouteForRideStart(){
  var routeway=[];
  var currentLocation = this.state.driverCurrentLocation
  var toLoc =currentLocation.latitude+"," + currentLocation.longitude;
  var destinationLocation = this.state.destinationLocation;
  var fromLoc =destinationLocation.latitude+"," + destinationLocation.longitude;
  var self = this;
  routeCall.findRouteBtwSourceAnDestination(toLoc,fromLoc,function(responseJson){
          if(responseJson){
            if (responseJson.routes.length){
              for(var i=0; i<responseJson.routes.length;i++){
                 var routesList = responseJson.routes[i];
                  for(var j=0; j<routesList.legs.length; j++){
                    var legsList = routesList.legs[j];
                    var distanceVal = legsList.distance.value;
                    var time = legsList.duration.text;
                    var valueTime = legsList.duration.value;
                    valueTime = self.getTimeFromGoogleValue(valueTime);
                    var disMiles = distanceVal / 1609.344;
                     var tokenAmount = Math.round(disMiles);
                     if(tokenAmount === 0){
                        tokenAmount = 1;
                     }
                     self.setState({routeCostToken:tokenAmount});
                     self.setState({routeDistance:disMiles});
                     self.setState({routeTotalTime:time});
                     for(var s =0; s < legsList.steps.length; s++){
                        var stepsList = legsList.steps[s];
                        var polyPoints = stepsList.polyline.points;
                         routeCall.decodePolyline(polyPoints,1,function(points){
                           for(var p =0;p < points.length;p++){
                              routeway.push(points[p]);
                           }
                         });
                     }
                  }
              }
              self.setState({rideStartRoutePolyline: [...routeway]});
              self.setState({ calculatingRoute: false });
              self.setState({isDestinationRouteDraw:true});
            }else{
              console.log("Alert","Something went wrong geting route directions." + JSON.stringify(responseJson.message))
              self.setState({ calculatingRoute: false });
            }
          }
    });
}

_getRiderRoute(){
  var  routeway=[];
  var currentLocation = this.state.currentLocation
  var toLoc =currentLocation.latitude+"," + currentLocation.longitude;
  var destinationLocation = this.state.destinationLocation;
  var fromLoc =destinationLocation.latitude+"," + destinationLocation.longitude;
  var self = this;
  routeCall.findRouteBtwSourceAnDestination(toLoc,fromLoc,function(responseJson){
          if(responseJson){
            if (responseJson.routes.length){
              for(var i=0; i<responseJson.routes.length;i++){
                 var routesList = responseJson.routes[i];
                  for(var j=0; j<routesList.legs.length; j++){
                    var legsList = routesList.legs[j];
                    var distanceVal = legsList.distance.value;
                    var time = legsList.duration.text;
                    var valueTime = legsList.duration.value;
                    valueTime = self.getTimeFromGoogleValue(valueTime);

                    var disMiles = distanceVal / 1609.344;
                     var tokenAmount = Math.round(disMiles);
                     if(tokenAmount === 0){
                        tokenAmount = 1;
                     }
                     self.setState({routeCostToken:tokenAmount});
                     self.setState({routeDistance:disMiles});
                     self.setState({routeTotalTime:time});
                     for(var s =0; s < legsList.steps.length; s++){
                        var stepsList = legsList.steps[s];
                        var polyPoints = stepsList.polyline.points;
                         routeCall.decodePolyline(polyPoints,1,function(points){
                           for(var p =0;p < points.length;p++){
                              routeway.push(points[p]);
                           }
                         });
                     }
                  }
              }
              self.setState({routePolylines: [...routeway]});
              self.setState({ calculatingRoute: false });
              self.setState({isDestinationRouteDraw:true});

            }else{
              Alert.alert("Alert","Something went wrong geting route directions." + JSON.stringify(responseJson.message))
              self.setState({ calculatingRoute: false });
            }
          }
    });
}

//request for ride approve
approveRequestPopup(){
  this.requestRide(this.state.routeCostToken);
  this.setState({loaderVisible:true});
}

// decline ride request and close and clean map route
declineRequestPopup(){
  this.popupDialog.dismiss();
  this.setState({routePolylines: []});
  this.setState({isCalculatedResult: false });
  this.setState({calculatingRoute: false });
  this.setState({isDestinationRouteDraw:false});
  this.setState({destinationAddress:'My Destination Address'})
  this.setState({rateByRider:false});
  this.setState({rateDriverPopup:false});
  this.setState({isDriverApprovedRide:false})
  this.setState({isDriverApp:false})
  this.setState({rateRiderPopup:false})
  AsyncStorage.setItem("type","home");
}

onSendRequest(){
  this.popupDialog.show();
  AsyncStorage.setItem("rider","send_request_dialog");
  AsyncStorage.setItem("type","isRider");
}

onGoButton() {
  var destination = this.state.destinationAddress;
  AsyncStorage.setItem("destinationAddress",destination);
  if(destination === "My Destination Address"){
     Alert.alert('Alert', "Please choose destination." )
  }else{
    this.setState({ isCalculatedResult: true });
  }
  AsyncStorage.setItem("type","isRider");
  AsyncStorage.setItem("rider","go");
}

requestRide(tokenAmount){
     var self = this
     tokenAmount = tokenAmount * 1 // 1 token for 1 miles
     riderApiCall.nextRideId(this.state.userEthereumAddress,function(err,result){
       if(result){
           var ride_id = result.toString(16);
           self.setState({rideId:ride_id})
           self.sendRideRequest(tokenAmount);
       }else{
         Alert.alert('Something went wrong while requesting a ride. ' + err)
       }
     });
  }

sendRideRequest(tokenAmount){
  var self = this;
  riderApiCall.rideRequest(this.state.userPrivateKey,tokenAmount,function(err,result){
    if(result){
      //setting flag to don't show view for driver ride request popups if I am same user
       self.setState({isRiderApp:true})
       self.closeRideRequestPopUp();
    }else{
      Alert.alert('Something went wrong while requesting a ride. ' + err)
    }
  });
}

rateByRider(){
  var userRating = this.state.ratingStarValue;
  riderApiCall.rateByRider(this.state.userPrivateKey,this.state.rideId,userRating,function(err,result){
      if(result){
        self.setState({rateByRider:false});
        self.setState({rateDriverPopup:false});
        self.setState({routePolylines:[]})
        self.setState({isDestinationRouteDraw:false})
        self.setState({isCalculatedResult:false});
        self.setState({isDriverApprovedRide:false})
        self.setState({isDriverApp:false})
        self.setState({rateRiderPopup:false})
        self.setState({riderRequestPolyline:[]})
        self.setState({loaderVisible:false});
        self.setState({driverRideRequest:false});
        self.setState({rideStartAndPickedUp:false});
        AsyncStorage.setItem("type","home");
      }
  });
}
/**Close popup dialog @author SynsoftGlobal**/
closeRideRequestPopUp()
   {
      this.popupDialog.dismiss();
       this.setState({
           loaderVisible: false
         });
     this.setState({searchingForDriver:true});
     this.riderRequest();
     this.fetchUserBalanceDispatcher();
    AsyncStorage.setItem("rider","ride_request_for_driver");
 }

closeRiderNotifiedDialog(){
  this.riderNotifiedDialog.dismiss();
  this.setState({riderWaitingForPickUp:true});
  this.drawRouteBtwDriverAndRiderLocation();
  AsyncStorage.setItem("rider","ride_approved_driver");
}

/******Method send details to Driver for ride Request********************************/
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
         rideId: this.state.rideId,
         riderId:'0x0fb374a56616bec8b8cb5a45bcd49e8e16b1abfb',
         riderProfileIPFS:this.state.userProfileIPFS,
         //riderProfileData:this.state.loginUserData,
         riderName : this.state.loginName,
         riderProfilePic: this.state.loginProfilePic,
         riderFBId : this.state.loginFBID,

     })
   console.warn('jsonData' +JSON.stringify(jsonData));
   webAPICall.postApiWithJosnDataInMainThread(riderURL,jsonData,'POST').then((responseJson) =>
    {
     if(responseJson)
       {
           console.log(JSON.stringify(responseJson));
         }
     }).done();
}

cancelRide(){
  Alert.alert( 'Alert', 'Are you sure you want to cancel Ride.',
  [
    {text: 'Yes', onPress: () => { this.clearAndCancelRide()}},
    {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
  ], { cancelable: false });
}

clearAndCancelRide(){
    this.cleanAllStatesAndOpenHome();
}
riderEmergencyButton(){
  Alert.alert('Alert','Click here..');
}
/*******************************End Rider Components*****************************************/



render()
  {


  return (
        <View style={styles.container}>
          <HomeTopBar tokenBalance = {this.state.tokenBalance}
            loginProfilePic = {this.state.loginProfilePic}/>
          <PriceTimer/>
          <View style={ styles.mapWrapper } >

          <MapView style={styles.map}
            ref={component => this._map = component}
            region={this.state.region}
            onRegionChangeComplete={this.onRegionChange.bind(this)}
             showsCompass={true}  defaultZoom={12}
             followUserLocation={true}  showsUserLocation={true} >
             {!this.state.isDriverApp && !this.state.rideStartAndPickedUp &&
              <MapView.Marker
                  title='Your location'
                  coordinate={ this.state.currentLocation }
                  pinColor='#4595fa'
                />
              }
              {this.state.isRiderApp && this.state.rideStartAndPickedUp &&
                <MapView.Marker
                        title= 'Your Location'
                        coordinate={ this.state.driverCurrentLocation }
                        image={require("@Resources/Images/driver-car.png")}
                />
              }
              {!this.state.isDriverApp && !this.state.isDestinationRouteDraw &&
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
                          image={require("@Resources/Images/driver-car.png")}
                  />
                }
          </MapView>
            { this.renderMyLocationButton }
          </View>
          { this.renderBottomContent }

          <Modal visible={this.state.modalVisible} onRequestClose={() => {this.setState({modalVisible:false })}}>
              <AutoCompleteAddressModel onSelect = {(value) => {
                if (this.state.isDestinationSelected){
                  this._coordinatesFromAddress(value)
                   this.setState({ destinationAddress: value, modalVisible:false });
                }else{
                     this._coordinatesFromAddress(value)
                    this.setState({ myLocationAddress: value, modalVisible:false });
                }
             }}
             onCancel ={()=>{this.setState({modalVisible:false });}} />
          </Modal>

            <PopupDialog ref={(popupDialog) => { this.popupDialog = popupDialog; }}
                closeOnTouchOutside={false} haveOverlay={true} closeOnHardwareBackPress={false} width="90%" height="45%">
              <View style={{flex: 1,flexDirection: 'column',}}>
                    <View style={{alignItems:'center'}}>
                    <Text style={styles.textSendRequestTitle}>Permission</Text>
                    </View>
               <View style={{  backgroundColor:'#4595fa',marginTop: 5, height:1.5,marginLeft:18,marginRight:18}}></View>
                 <Text style={styles.textSendRequestOne}>By sending request you approve </Text>
                 <View style={{flexDirection:'row' ,flex:1,justifyContent:'center',}}>
                  <Text style={ styles.textSendRequestTwo }>of sending </Text>
                   <Image source={ require("@Resources/Images/token.png") } style={{  width: 22,height: 22, marginTop:6, marginRight:3} }/>
                   <Text style={ styles.textSendRequestTwo }>{this.state.routeCostToken} to Escrow.</Text>
                 </View>
                 <View style={{alignItems:'center',flexDirection: 'column', marginTop:-8,}}>
                 <Text style={styles.textSendRequestApprove}>By Approving you agree to our</Text>
                 <TouchableOpacity  onPress={this.openTermsDialog.bind(this)} >
                  <Text style={styles.textSendRequestTerms}>Terms and Conditions</Text>
                  </TouchableOpacity>
                 </View>
                <View style={{flexDirection:'row' ,flex:1,justifyContent:'center', marginTop:20}}>
                 <View style ={styles.buttonSendRequestApprove}>
                    <TouchableOpacity  onPress={this.approveRequestPopup.bind(this)} >
                        <Text style={styles.popUpButtonText} > Approve </Text>
                    </TouchableOpacity>
                  </View>

                  <View style ={styles.buttonSendRequestDecline}>
                     <TouchableHighlight  onPress={this.declineRequestPopup.bind(this)} >
                         <Text style={styles.popUpButtonText} > Decline </Text>
                     </TouchableHighlight>
                   </View>
                 </View>
               </View>
              </PopupDialog>


            <PopupDialog
                ref={(driverPopupDialog) => { this.driverPopupDialog = driverPopupDialog; }}
                closeOnTouchOutside={false} haveOverlay={true} closeOnHardwareBackPress={false} width="90%" height="45%">
                <View style={{flex: 1,flexDirection: 'column',}}>
                    <View style={{alignItems:'center'}}>
                    <Text style={styles.textSendRequestTitle}>Permission</Text>
                    </View>
               <View style={{  backgroundColor:'#4595fa',marginTop: 5, height:1.5,marginLeft:18,marginRight:18}}></View>
                 <Text style={styles.textSendRequestOne}>By sending request you approve </Text>
                 <View style={{flexDirection:'row' ,flex:1,justifyContent:'center',}}>
                  <Text style={ styles.textSendRequestTwo }>of sending </Text>
                   <Image source={ require("@Resources/Images/token.png") } style={{  width: 22,height: 22, marginTop:6, marginRight:3} }/>
                   <Text style={ styles.textSendRequestTwo }>{this.state.driverRideRequestCost} to Escrow.</Text>
                 </View>

                 <View style={{alignItems:'center',flexDirection: 'column', marginTop:-8,}}>
                 <Text style={styles.textSendRequestApprove}>By Approving you agree to our</Text>
                 <TouchableHighlight  onPress={this.openTermsDialog.bind(this)} >
                  <Text style={styles.textSendRequestTerms}>Terms and Conditions</Text>
                  </TouchableHighlight>
                 </View>

                <View style={{flexDirection:'row' ,flex:1,justifyContent:'center', marginTop:20}}>
                 <View style ={styles.buttonSendRequestApprove}>
                    <TouchableHighlight  onPress={this.approveRideRequestPopup.bind(this)} >
                        <Text style={styles.popUpButtonText} > Approve </Text>
                    </TouchableHighlight>
                  </View>

                  <View style ={styles.buttonSendRequestDecline}>
                     <TouchableHighlight  onPress={this.declineRideRequestPopup.bind(this)} >
                         <Text style={styles.popUpButtonText} > Decline </Text>
                     </TouchableHighlight>
                   </View>
                 </View>
               </View>
              </PopupDialog>

            <PopupDialog
                   ref={(riderNotifiedDialog) => { this.riderNotifiedDialog = riderNotifiedDialog;}}
                   style={{backgroundColor:'rgba(0, 0, 0, 0.75'}}
                   closeOnTouchOutside={false} haveOverlay={true} closeOnHardwareBackPress={false} width="90%" height="50%">
              <View style={{flex: 1,flexDirection: 'column'}}>
                 <View style={styles.popup_bg_sub_view1}>
                    <Text style={ styles.congratulations_text }>Congratulations!</Text>
                    <View style={styles.user_bg_view}>
                        <Image source = {{uri:this.state.driverProfilePic}} style={styles.user_image}></Image>
                      <View style={styles.user_address_view}>
                        <Text style={ styles.user_name_text }>{this.state.driverFullName}</Text>
                        <Text style={ styles.user_address_text }>{this.state.driverCarName}</Text>
                        <Text style={ styles.user_address_text }>Plate Number:{this.state.driverCarPlateNumber}</Text>
                      </View>
                    </View>
                    <Text style={ styles.pickup_text }>Will Pick You Up</Text>
                 </View>
                 <View style={styles.popup_bg_sub_view2}>
                    <View style={styles.call_view}>
                      <TouchableOpacity onPress={this.callDriver.bind(this)}>
                        <Text style={ styles.call_text }>Call {this.state.driverName}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.close_View}>
                      <TouchableOpacity onPress={this.closeRiderNotifiedDialog.bind(this)}>
                        <Text style={styles.close_text}>Close</Text>
                      </TouchableOpacity>
                    </View>
                 </View>

              </View>

            </PopupDialog>


              <PopupDialog  ref={(termsConditionDialog) => { this.termsConditionDialog = termsConditionDialog;}}
               closeOnTouchOutside={false} haveOverlay={true} closeOnHardwareBackPress={false} width="95%" height="95%">
               <View style={{flexDirection:'column',}}>
               <View style={{height:50,justifyContent:'center',alignItems:'center',flexDirection:'row',backgroundColor:'#4595fa',}}>
                  <Text style={{fontFamily: 'Exo-Regular',textAlign:'center',fontSize:18,color:'#FFF'}}>Terms and Conditions </Text>
                  <View style={{right:5,position:'absolute'}}>
                  <TouchableHighlight onPress={this.closeTermsDialog.bind(this)}>
                   <Text style={{fontFamily: 'Exo-Regular',textAlign:'center',fontSize:16,color:'#FFF'}}>Close</Text>
                   </TouchableHighlight>
                   </View>
                 </View>
                  <View style={{width:'100%',height:'100%'}}>
                    <WebView
                      source={{uri: 'https://www.commuterz.io/'}}
                      javaScriptEnabled={true}
                      domStorageEnabled={true}
                      startInLoadingState={true}
                    />
                  </View>

                </View>
              </PopupDialog>

            <Spinner visible={this.state.loaderVisible} overlayColor={ "rgba(0, 0, 0, 0.50)" }/>

            <Spinner overlayColor={ "rgba(0, 0, 0, 0.75)" } visible={ this.state.calculatingRoute }>
              <View style={ styles.calculatingRouteContainer }>
                <Image source={ require("@Resources/Images/calculating-route.png") } style={ styles.imageCalculatingRoute }/>
              </View>
            </Spinner>

        </View>
    );
  }

get renderMyLocationButton() {

  if(this.state.isDriverApp){
    if(this.state.isRideStarted){
        return(
            <View style={{flexDirection:'column'}}>
                <TouchableHighlight activeOpacity={ .5 } style={ styles.buttonCallIcon } onPress={this.rideEndByDriver.bind(this)}>
                  <Image source={ require("@Resources/Images/ride-start-icon.png") } style={ styles.imageCallIcon }/>
                </TouchableHighlight>
                <TouchableHighlight activeOpacity={ .5 } style={ styles.buttonEndRideText } onPress={this.rideEndByDriver.bind(this)}>
                    <Text style={{padding:5,fontSize:16,fontFamily:'Exo-Medium',backgroundColor:'rgba(0,0,0,0.75)',color:'#FFF'}}>End Ride</Text>
                </TouchableHighlight>
            </View>
        );
    }
    else if(this.state.isDriverApprovedRide){
        return(
          <View style={{flexDirection:'column'}}>
            <TouchableHighlight activeOpacity={ .5 } style={ styles.buttonEndRideText } onPress={this.startRideOnButton.bind(this)}>
                <Text style={{padding:5,fontSize:16,fontFamily:'Exo-Medium',backgroundColor:'rgba(0,0,0,0.75)',color:'#FFF'}}>
                  Start Ride
                </Text>
            </TouchableHighlight>
            <TouchableHighlight activeOpacity={ .5 } style={ styles.buttonCallIcon } onPress={ this.checkDriverReachNearToRider.bind(this)}>
              <Image source={ require("@Resources/Images/call-icon.png") } style={ styles.imageCallIcon }/>
            </TouchableHighlight>
          </View>
        );
    }
  }else{
    if(this.state.isCalculatedResult && this.state.riderWaitingForPickUp){
        return(
          <TouchableHighlight activeOpacity={ .5 } style={ styles.buttonCallIcon }>
              <Image source={ require("@Resources/Images/call-icon.png") } style={ styles.imageCallIcon }/>
          </TouchableHighlight>
        );
    }else if(this.state.isCalculatedResult && this.state.rideStartAndPickedUp){
      <TouchableHighlight activeOpacity={ .5 } style={ styles.buttonCallIcon }>
        <Image source={ require("@Resources/Images/ride-start-icon.png") } style={ styles.imageCallIcon }/>
      </TouchableHighlight>
    }else if(this.state.isCalculatedResult){
        return(
          <TouchableHighlight activeOpacity={ .5 } style={ styles.buttonMyLocation } onPress={this.onChangeLocation.bind(this)} >
              <Image source={ require("@Resources/Images/focusLocation.png") } style={ styles.imageFocusLocation }/>
          </TouchableHighlight>
        );
    }else{
      return(
        <TouchableHighlight activeOpacity={ .5 } style={ styles.buttonMyLocation } onPress={this.onChangeLocation.bind(this)} >
            <Image source={ require("@Resources/Images/focusLocation.png") } style={ styles.imageFocusLocation }/>
        </TouchableHighlight>
      );
    }
  }
}

get renderBottomContent(){
  if(this.state.isDriverApp){
      if(this.state.openRideRequestPopup){
          return(
            <View style={ styles.driverBottomRequestContainer }>
              <View style={styles.driverPickupRequestView }>
                    <Text style={ styles.driverTextPickUp }>You Have a Ride Request! </Text>
                      <View style={{flexDirection:'column' ,flex:1, marginTop:5}}>
                          <View style={{flexDirection:'row',flex:1,justifyContent:'center',}}>
                              <View style={ styles.driverAvatarWrapper }>
                              {this.state.riderProfilePic === '' &&
                              <Image source={ require("@Resources/Images/oval.png") } style={ styles.driverImageAvatar }/>
                              }
                              {this.state.riderProfilePic !='' &&
                              <Image source={{uri:this.state.riderProfilePic}} style={ styles.driverImageAvatar }/>
                              }
                              </View>
                               <View>
                                  <View style={{flexDirection:'row',flex:1,justifyContent:'flex-start', marginLeft:5}}>
                                      <Text style={styles.driverNameTest} > {this.state.riderFullName} </Text>
                                  </View>
                                  <View style={{flexDirection:'row',flex:1,justifyContent:'flex-start', marginTop:-5,marginLeft:5}}>
                                      <Text style={styles.driverRidePriceText} > Price of Ride: </Text>
                                      <Image source={ require("@Resources/Images/token.png")  } style={ styles.driveImageToken }/>
                                      <Text style={styles.driverRideTokenAmount} > {this.state.driverRideRequestCost} </Text>
                                  </View>
                               </View>
                          </View>
                       </View>
               </View>

              <View style={{flexDirection:'column' ,flex:1, height:130}}>
                   <View style={{flexDirection:'row' , backgroundColor:'#FFF',height:65,justifyContent:'center',alignItems:'center'}}>
                      <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                        <Image source={ require("@Resources/Images/driver-location.png")  } style={ styles.driveImageToken }/>
                          <Text  numberOfLines={2} style={{width:100,fontFamily: 'Exo-Medium', fontSize:14, color:'#9b9b9b',marginLeft:10}} >{this.state.driverPickUpSourceAddress}</Text>
                        </View>
                      <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                        <Image source={ require("@Resources/Images/destination-icon-driver.png")  } style={ styles.driveImageToken }/>
                        <Text  numberOfLines={2}  style={{width:100,fontFamily: 'Exo-Medium', fontSize:14, color:'#9b9b9b',marginLeft:10}} >{this.state.driverPickUpDestinationAddress} </Text>
                   </View>
                   </View>
                   <View style={{flexDirection:'row' , backgroundColor:'#FFF',height:65,justifyContent:'center',alignItems:'center'}}>
                    <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                       <Image source={ require("@Resources/Images/clock.png")  } style={ styles.driveImageToken }/>
                     <Text style={{width:100,fontFamily: 'Exo-Medium',  fontSize:20,color:'#9b9b9b',marginLeft:10}} >{this.state.driverPickUpTime} </Text>
                     </View>
                       <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                     <Image source={ require("@Resources/Images/path-icon.png")  } style={ styles.driveImageToken }/>
                       <Text style={{width:100,fontFamily: 'Exo-Medium',  fontSize:20,color:'#9b9b9b',marginLeft:10}} >{this.state.driverPickUpDistance} </Text>
                       </View>
              </View>
              </View>
              <View style={{flexDirection:'row', justifyContent:'center',height:50,bottom:0}}>
                   <View style ={styles.driverAcceptRideBtn}>
                        <TouchableHighlight  onPress={this.acceptRideRequest.bind(this)} >
                            <Text style={{fontFamily: 'Exo-Medium',  textAlign:'center',color:'#fff',fontSize: 20,}} > Accept Ride </Text>
                        </TouchableHighlight>
                      </View>
                      <View style ={styles.driverDeclineRideBtn}>
                         <TouchableHighlight  onPress={this.declineRideRequest.bind(this)} >
                             <Text style={{fontFamily: 'Exo-Medium',  textAlign:'center',color:'#fff',fontSize: 20,}} > Decline Ride </Text>
                         </TouchableHighlight>
                    </View>
              </View>
            </View>
          );
      }else if(this.state.isDriverApprovedRide){
          return(
            <View style={styles.driverRideApprovedRectangle}>
            <View style={{flexDirection:'column' , height:40}}>
              <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
               <Text  numberOfLines={1}  style={styles.rideApproveTimePickUp}>Time to Pickup </Text>
                <Text  numberOfLines={1}  style={styles.rideApproveTimePickUp}>Distance to Pickup </Text>
              </View>
              </View>
              <View style={{flexDirection:'column', height:63}}>
              <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                  <View style={styles.rideViewRectangle}>
                  <Text  numberOfLines={1}  style={styles.rideApproveTextTimeDistance}>{this.state.timeToPickUpByDriver}</Text>
                  <Text  numberOfLines={1}  style={styles.rideApproveTextMinMiles}>{this.state.timeValueInText}</Text>
                  </View>
                  <View style={styles.rideViewRectangleRight}>
                  <Text  numberOfLines={1}  style={styles.rideApproveTextTimeDistance}>{this.state.distanceToPickByDriver}</Text>
                  <Text  numberOfLines={1}  style={styles.rideApproveTextMinMiles}>miles</Text>
                  </View>
              </View>
                </View>
            </View>
          );
      }else if(this.state.rateDriverPopup){
            return(
              <View style={styles.rateRectangle}>
              <View style={{height:50,backgroundColor:'#5fdf71',justifyContent:'center'}}>
              <Text style={{fontSize:20,color:'#fff',fontFamily:'Exo-Medium',textAlign:'center'}}>You Have Reached Your Destination </Text>
              </View>
              <View style={{height:85,justifyContent:'center',alignItems:'center'}}>
              <Stars
                isActive={true}
                rateMax={5}
                isHalfStarEnabled={true}
                onStarPress={this.ratingCompleted.bind(this)}
                rate={0}
                size={45}
              />
               <Text style={{fontSize:16,color:'#9b9b9b',fontFamily:'Exo-Medium',textAlign:'center'}}>Rate This Ride</Text>
              </View>
              <View style={{height:50,backgroundColor:'#5fdf71',justifyContent:'center'}}>
              <TouchableHighlight activeOpacity={ .5 } onPress={this.rateAndEndRideDriver.bind(this) }>
                  <Text style={{fontSize:22,color:'#fff',fontFamily:'Exo-Medium',textAlign:'center'}}>End Ride</Text>
              </TouchableHighlight>
              </View>
             </View>
         );
      }
  }else{
    if(!this.state.isCalculatedResult){
      return(
        <View style={ styles.bottomGoContainer }>
            <View style={ styles.inputTextContainer }>
             <Image source={ require("@Resources/Images/search-blue.png") } style={{marginLeft:8,marginRight:'3%',} }/>
             <TouchableHighlight activeOpacity={ .5 } style={{alignItems: 'center',justifyContent: 'center',}}
                onPress={() => {  this.setState({modalVisible: true,isDestinationSelected:false})}}>
                  <Text style={ styles.locationAddress} numberOfLines={1}>{ this.state.myLocationAddress } </Text>
                </TouchableHighlight>
            </View>
              <View style={{height:1,backgroundColor:'#4595fa'} }/>
              <View style={ styles.inputTextContainer }>
              <Image source={ require("@Resources/Images/destination-flag-blue.png") } style={{marginLeft:8,marginRight:'3%',}}/>
              <TouchableHighlight activeOpacity={ .5 } style={{alignItems: 'center',justifyContent: 'center',}}
              onPress={() => {  this.setState({modalVisible: true, isDestinationSelected:true})}}>
                <Text style={ styles.locationAddress} numberOfLines={1}>{ this.state.destinationAddress } </Text>
              </TouchableHighlight>
              </View>
              <TouchableHighlight activeOpacity={ .5 } onPress={this.onGoButton.bind(this) }>
                <View style={ styles.buttonWrapper }>
                  <Text style={ styles.textButton }>GO!</Text>
                  <Image source={ require("@Resources/Images/rabbit-icon-white.png") } style={ styles.imageRabbit }/>
                </View>
              </TouchableHighlight>
        </View>
      );
    }
    else if(this.state.isCalculatedResult && this.state.searchingForDriver){
        return(
          <View style={ styles.bottomWaitAndCancelContainer }>
            <View style={{width:screenWidth, height:20,justifyContent:'center',alignItems:'center' }}>
                <Text style={{fontFamily: 'Exo-Regular',fontSize: 14, color: '#333',}}>Please wait searching for driver</Text>
             </View>
              <View style={ styles.userPrizeContainer }>
                <Text style={ styles.textCostOfRide }>Cost Of Ride: </Text>
                <Image source={ require("@Resources/Images/token.png") } style={ styles.imageToken }/>
                <Text style={ styles.textCostOfRideValue }>{this.state.routeCostToken}</Text>
              </View>
              <View style={{width:screenWidth,height:44,}}>
              <TouchableHighlight activeOpacity={ .5 } onPress={ () => this.cancelRide() }>
                <View style={ styles.buttonWrapper }>
                  <Text style={ styles.textButton }>Cancel Ride</Text>
                </View>
              </TouchableHighlight>
              </View>
          </View>
        );
    }else if(this.state.isCalculatedResult && this.state.riderWaitingForPickUp){
        return(
          <View style={styles.driverRideApprovedRectangle}>
          <View style={{flexDirection:'column' , height:40}}>
            <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
             <Text numberOfLines={1}  style={styles.rideApproveTimePickUp}>Time to Pickup </Text>
              <Text numberOfLines={1}  style={styles.rideApproveTimePickUp}>Distance to Pickup </Text>
            </View>
            </View>
            <View style={{flexDirection:'column', height:63}}>
            <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                <View style={styles.rideViewRectangle}>
                <Text  numberOfLines={1}  style={styles.rideApproveTextTimeDistance}>{this.state.riderTimeToDestination}</Text>
                <Text  numberOfLines={1}  style={styles.rideApproveTextMinMiles}>{this.state.timeValueInText}</Text>
                </View>
                <View style={styles.rideViewRectangleRight}>
                <Text  numberOfLines={1}  style={styles.rideApproveTextTimeDistance}>{this.state.riderDistanceRemained}</Text>
                <Text  numberOfLines={1}  style={styles.rideApproveTextMinMiles}>miles</Text>
                </View>
            </View>
              </View>
          </View>
        );
    }else if(this.state.isCalculatedResult && this.state.rideStartAndPickedUp){
        return(
          <View style={styles.driverRideApprovedRectangle}>
          <View style={{flexDirection:'column' , height:40}}>
            <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
             <Text numberOfLines={1}  style={styles.rideApproveTimePickUp}>Time to Destination </Text>
              <Text numberOfLines={1}  style={styles.rideApproveTimePickUp}>Distance Remained</Text>
            </View>
            </View>
            <View style={{flexDirection:'column', height:63}}>
            <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                <View style={styles.rideViewRectangle}>
                <Text  numberOfLines={1}  style={styles.rideApproveTextTimeDistance}>{this.state.riderTimeToDestination}</Text>
                <Text  numberOfLines={1}  style={styles.rideApproveTextMinMiles}>{this.state.timeValueInText}</Text>
                </View>
                <View style={styles.rideViewRectangleRight}>
                <Text  numberOfLines={1}  style={styles.rideApproveTextTimeDistance}>{this.state.riderDistanceRemained}</Text>
                <Text  numberOfLines={1}  style={styles.rideApproveTextMinMiles}>miles</Text>
                </View>
            </View>
              </View>
          </View>
        );
    }else if(this.state.isCalculatedResult && this.state.rateRiderPopup){
      return(
          <View style={styles.rateRectangle}>
          <View style={{height:50,backgroundColor:'#5fdf71',justifyContent:'center'}}>
          <Text style={{fontSize:20,color:'#fff',fontFamily:'Exo-Medium',textAlign:'center'}}>You Have Reached Your Destination </Text>
          </View>
          <View style={{height:85,justifyContent:'center',alignItems:'center'}}>
          <Stars
            isActive={true}
            rateMax={5}
            isHalfStarEnabled={true}
            onStarPress={this.ratingCompleted.bind(this)}
            rate={0}
            size={45}
          />
           <Text style={{fontSize:16,color:'#9b9b9b',fontFamily:'Exo-Medium',textAlign:'center'}}>Rate This Ride</Text>
          </View>
          <View style={{height:50,backgroundColor:'#5fdf71',justifyContent:'center'}}>
          <TouchableHighlight activeOpacity={ .5 } onPress={this.rateAndEndRideDriver.bind(this) }>
              <Text style={{fontSize:22,color:'#fff',fontFamily:'Exo-Medium',textAlign:'center'}}>End Ride</Text>
          </TouchableHighlight>
          </View>
         </View>
        );
    }else if(this.state.isCalculatedResult){
        return(
          <View style={ styles.bottomSendRequestContainer }>
            <View style={ styles.userPrizeContainer }>
              <Text style={ styles.textCostOfRide }>Cost Of Ride: </Text>
              <Image source={ require("@Resources/Images/token.png") } style={ styles.imageToken }/>
              <Text style={ styles.textCostOfRideValue }>{this.state.routeCostToken}</Text>
            </View>
            <View style={{width:screenWidth,height:44,}}>
            <TouchableHighlight activeOpacity={ .5 } onPress={ () => this.onSendRequest() }>
              <View style={ styles.buttonWrapper }>
                <Text style={ styles.textButton }>Send Request</Text>
              </View>
            </TouchableHighlight>
            </View>
          </View>
        );
    }
  }
}


openTermsDialog(){
  this.termsConditionDialog.show();
}
closeTermsDialog(){
  this.termsConditionDialog.dismiss();
}
/****************************Driver App Side Code*****************************************************************/
drawRouteBtwDriverAndRiderLocation(){
  //console.warn('drawRouteBtwDriverAndRiderLocation');
  var self =this;
  var  routeway=[];
  var driverCurrentLocation = this.state.currentLocation;
  var toLoc =driverCurrentLocation.latitude+"," + driverCurrentLocation.longitude;
  this.setState({driverCurrentLocation:this.state.currentLocation})

  var riderLocation = this.state.driverPickUpSource;
  var riderWayPoint = riderLocation.latitude +"," + riderLocation.longitude;

  var riderDestination = this.state.driverPickUpDestination;
  var fromLoc = riderDestination.latitude+"," + riderDestination.longitude;
  routeCall.findRouteBtwSourceAnDestinationWithWayPoint(toLoc,fromLoc,riderWayPoint,function(responseJson){
      if(responseJson){
        if (responseJson.routes.length) {
           for(var i=0; i<responseJson.routes.length;i++){
              var routesList = responseJson.routes[i];
               for(var j=0; j<routesList.legs.length; j++){
                 var legsList = routesList.legs[j];
                 var distanceVal = legsList.distance.value;
                 var time = legsList.duration.value;
                 var disMiles = distanceVal / 1609.344;
                 disMiles = parseFloat(Math.round(disMiles * 100) / 100).toFixed(2) +"";

                 self.setState({distanceToPickByDriver:disMiles})
                 self.setState({timeToPickUpByDriver:self.getTimeFromGoogleValue(time)})

                  for(var s =0; s < legsList.steps.length; s++){
                     var stepsList = legsList.steps[s];
                     var polyPoints = stepsList.polyline.points;
                      routeCall.decodePolyline(polyPoints,1,function(points){
                        for(var p =0;p < points.length;p++){
                           routeway.push(points[p]);
                        }
                      });
                  }
               }
           }
          self.setState({riderRequestPolyline: [...routeway] });
          self.setState({loaderVisible:false});
        }
      }else{
        Alert.alert("Alert","Something went wrong geting route directions." + JSON.stringify(responseJson.message))
      }
  });
}

//approve ride request open poup for confirmation
acceptRideRequest(){
  AsyncStorage.setItem("driver","approve_ride");
 this.driverPopupDialog.show();
}
//decline ride request button when any ride request from customer
declineRideRequest(){
  Alert.alert( 'Alert', 'Are you sure you want to decline request.',
  [
    {text: 'Yes', onPress: () => {
      this.cleanAllStatesAndOpenHome();
    }},
    {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
  ], { cancelable: false });
  AsyncStorage.setItem("type","home");

}

cleanAllStatesAndOpenHome(){
 this.setState({searchingForDriver:false});
 this.setState({routePolylines:[]})
 this.setState({driverRideRequest:false});
 this.setState({riderRequestPolyline:[]});
 this.setState({rateByRider:false});
 this.setState({isRiderApp:false});
 this.setState({rateDriverPopup:false});
 this.setState({isDestinationRouteDraw:false})
 this.setState({isCalculatedResult:false});
 this.setState({isDriverApprovedRide:false})
 this.setState({isDriverApp:false})
 this.setState({rateRiderPopup:false})
 this.setState({riderRequestPolyline:[]})
 this.setState({loaderVisible:false});
 this.setState({driverRideRequest:false});
 this.setState({rideStartAndPickedUp:false});
 this.setState({destinationAddress:'My Destination Address'})
  AsyncStorage.setItem("type","home");

}
//approve on popup button ride request and update same to server with rideId
approveRideRequestPopup(){
  var self= this;
    this.setState({loaderVisible:true});
    //console.warn("rideId" +this.state.rideIdGetByDriver);
    driverApiCall.rideApproveByDriver(this.state.userPrivateKey,this.state.rideIdGetByDriver,function(err,result){
        if(result){
            self.closeRiderRequestPopUp();
        }
  });
}

closeRiderRequestPopUp(){
  this.driverPopupDialog.dismiss();
  this.rideAcceptRequestNotification();
  this.setState({loaderVisible: false});
  this.setState({openRideRequestPopup:false});
  this.setState({isDriverApprovedRide:true});

  // refreshIntervalId = BackgroundTimer.setInterval(() => {
  //     // this will be executed every 200 ms
  //     // even when app is the the background
  //     this.checkDriverReachNearToRider()
  // }, 5000);
}

rideAcceptRequestNotification(){
   var jsonData = JSON.stringify(
        {
         source: this.state.currentLocation,
         destination: this.state.destinationLocation,
         token: this.state.riderDeviceToken,
         sourceAddress:this.state.myLocationAddress,
         destinationAddress:this.state.destinationAddress,
         distanceToPickUp: this.state.distanceToPickByDriver,
         costToken: this.state.routeCostToken,
         timeToPickUp:this.state.timeToPickUpByDriver,
         rideId: this.state.rideIdGetByDriver,
         driverIPFS:this.state.userProfileIPFS,
         driverName : this.state.loginName,
         driverProfilePic: this.state.loginProfilePic,
         type:'rideAcceptByDriver',
         driverCarName:this.state.driverCarName,
         driverCarPlateNumber:this.state.driverCarPlateNumber,
         driverCallNumber:this.state.driverCallNumber,
     });
    webAPICall.postApiWithJosnDataInMainThread(driverPushURL,jsonData,'POST').then((responseJson) =>
    {
     if(responseJson)
       {
           console.warn(JSON.stringify(responseJson));
         }
     }).done();
}

checkDriverReachNearToRider(){
  //console.warn("checking checkDriverReachNearToRider")
  var driverCurrentLocation = this.state.currentLocation;
  var riderCurrentLocation = this.state.driverPickUpSource;
  var self = this;
  commonUtility.getDistanceFromLatLonInKm(driverCurrentLocation.latitude,driverCurrentLocation.longitude,
    riderCurrentLocation.latitude,riderCurrentLocation.longitude,function(distance){
    if(distance <= 100){
      // Cancel the timer when you are done with it
      BackgroundTimer.clearInterval(refreshIntervalId);
      self.startRide();
    }else{
      Alert.alert('Alert','Ride can not be start as you are not in the range of 100 m from rider location.')
    }
  });
}

startRideOnButton(){
  BackgroundTimer.clearInterval(refreshIntervalId);
  AsyncStorage.setItem("driver","ride_start");
  Alert.alert('Ride Start','You have reached rider location.');
  this.setState({isRideStarted:true});
  this.setState({riderWaitingForPickUp:false})
  this.getTimeAndDistanceRemainedUsingDirectionAPI();
}

startRide(){
  AsyncStorage.setItem("driver","ride_start");
  Alert.alert('Ride Start','You have reached rider location.');
  this.setState({isRideStarted:true});
  this.setState({riderWaitingForPickUp:false})
  rideStartLocationInterval = BackgroundTimer.setInterval(() => {
      // this will be executed every 1 sec
      // even when app is the the background
      this.checkLastLocationOfDriverAndSendCurrentLocation();
  }, 1000);
}

checkLastLocationOfDriverAndSendCurrentLocation(){
  var self = this;
  AsyncStorage.getItem("lastLocation", (errs,result) => {
       if (!errs) {
           if (result !== null) {
             var data = JSON.parse(result);
             var lastLat = data.latitude;
             var lastlon = data.longitude;
             commonUtility.getDistanceFromLatLonInKm(this.state.currentLocation,this.state.destinationLocation,
               lastLat,lastlon,function(distance){
                 // if distance becomes greater than 0.5 km /500m then send update to rider.
               if(distance >= 500){
                 //self.sendNotifToRiderAboutRideStart();
                 self.getTimeAndDistanceRemainedUsingDirectionAPI();
               }
             });
           }
        }
   });
}

getTimeAndDistanceRemainedUsingDirectionAPI(){
  var self =this;
  var  routeway=[];
  var driverCurrentLocation = this.state.currentLocation;
  var toLoc =driverCurrentLocation.latitude+"," + driverCurrentLocation.longitude;
  this.setState({driverCurrentLocation:this.state.currentLocation})

  var riderLocation = this.state.driverPickUpSource;
  var riderWayPoint = riderLocation.latitude +"," + riderLocation.longitude;

  var riderDestination = this.state.driverPickUpDestination;
  var fromLoc = riderDestination.latitude+"," + riderDestination.longitude;
  routeCall.findRouteBtwSourceAnDestinationWithWayPoint(toLoc,fromLoc,riderWayPoint,function(responseJson){
      if(responseJson){
        if (responseJson.routes.length) {
           for(var i=0; i<responseJson.routes.length;i++){
              var routesList = responseJson.routes[i];
               for(var j=0; j<routesList.legs.length; j++){
                 var legsList = routesList.legs[j];
                 var distanceVal = legsList.distance.value;
                 var time = legsList.duration.value;
                 var disMiles = distanceVal / 1609.344;
                 disMiles = parseFloat(Math.round(disMiles * 100) / 100).toFixed(2) +"";
                 self.setState({distanceToPickByDriver:disMiles})
                 self.setState({timeToPickUpByDriver:self.getTimeFromGoogleValue(time)})
               }
           }
          self.sendNotifToRiderAboutRideStart();
        }
      }else{
        Alert.alert("Alert","Something went wrong geting route directions." + JSON.stringify(responseJson.message))
      }
  });
}


sendNotifToRiderAboutRideStart(){
  var jsonData = JSON.stringify(
       {
        source: this.state.currentLocation,
        destination: this.state.destinationLocation,
        token: this.state.riderDeviceToken,
        sourceAddress:this.state.myLocationAddress,
        destinationAddress:this.state.destinationAddress,
        distanceToPickUp: this.state.distanceToPickByDriver,
        costToken: this.state.routeCostToken,
        timeToPickUp:this.state.timeToPickUpByDriver,
        rideId: this.state.rideIdGetByDriver,
        driverIPFS:this.state.userProfileIPFS,
        driverName : this.state.loginName,
        driverProfilePic: this.state.loginProfilePic,
        type:'rideStartByDriver',
        driverCarName:this.state.driverCarName,
        driverCarPlateNumber:this.state.driverCarPlateNumber,
        driverCallNumber:this.state.driverCallNumber,
    });
   //console.warn("RideStart" + JSON.stringify(jsonData));
   this.callDriverRequestApiForNotifyingRider(jsonData);
}

callDriverRequestApiForNotifyingRider(jsonData){
  webAPICall.postApiWithJosnDataInMainThread(driverPushURL,jsonData,'POST').then((responseJson) =>
  {
   if(responseJson)
     {
         console.warn(JSON.stringify(responseJson));
       }
   }).done();
}

rideEndByDriver(){
  this.setState({loaderVisible:true});
  var self=this;
  driverApiCall.rideEndByDriver(this.state.userPrivateKey,this.state.rideIdGetByDriver,function(err,result){
      if(result){
          self.showRateViewForDriver();
      }else{
        Alert.alert("Alert","Something went wrong while ending your ride." +err);
        this.setState({loaderVisible:false});
      }
  });
}

showRateViewForDriver(){
  AsyncStorage.setItem("driver","ride_end_rate");
  this.setState({isRideStarted:false})
  this.setState({rateRiderPopup:true})
  this.setState({isDriverApprovedRide:false})
  this.setState({rateDriverPopup:true})
  this.setState({loaderVisible:false});
  this.notifyRiderForEndRide();
  BackgroundTimer.clearInterval(rideStartLocationInterval);
}

notifyRiderForEndRide(){
  var jsonData = JSON.stringify(
       {
        source: this.state.currentLocation,
        destination: this.state.destinationLocation,
        token: this.state.riderDeviceToken,
        sourceAddress:this.state.myLocationAddress,
        destinationAddress:this.state.destinationAddress,
        distanceToPickUp: this.state.distanceToPickByDriver,
        costToken: this.state.routeCostToken,
        timeToPickUp:this.state.timeToPickUpByDriver,
        rideId: this.state.rideIdGetByDriver,
        driverIPFS:this.state.userProfileIPFS,
        driverName : this.state.loginName,
        driverProfilePic: this.state.loginProfilePic,
        type:'driverEndRide',
        driverCarName:this.state.driverCarName,
        driverCarPlateNumber:this.state.driverCarPlateNumber,
        driverCallNumber:this.state.driverCallNumber,
    });
    this.callDriverRequestApiForNotifyingRider(jsonData);
}

rateAndEndRideDriver(){
  this.setState({loaderVisible:true});
  this.rateByDriver();
}

rateByDriver(){
  var userRating = this.state.ratingStarValue;
  var self = this;
  driverApiCall.rateByDriver(this.state.userPrivateKey,this.state.rideIdGetByDriver,userRating,function(err,result){
      if(result){
        self.setState({rateByRider:false});
        self.setState({rateDriverPopup:false});
        self.setState({routePolylines:[]})
        self.setState({isDestinationRouteDraw:false})
        self.setState({isCalculatedResult:false});
        self.setState({isDriverApprovedRide:false})
        self.setState({isDriverApp:false})
        self.setState({rateRiderPopup:false})
        self.setState({riderRequestPolyline:[]})
        self.setState({loaderVisible:false});
        self.setState({driverRideRequest:false});
        AsyncStorage.setItem("type","home");
      }
  });
}
//popup dialog decline ride request and clear bottom window or ride request
declineRideRequestPopup(){
  this.driverPopupDialog.dismiss();
  this.setState({driverRideRequest:false});
}

ratingCompleted(rating) {
  //alert('rating' + rating)
  this.setState({ratingStarValue:rating})
}

/*****************************End Driver App Side Code************************************************/


onRegionChange(region) {
    this.setState({region})
}

/***********************Extra Functions***********************************/


callDriver(){
  alert('callDriver')
}

getTimeFromGoogleValue(time){
  var googleTime = Math.round(time);
  var hours   = Math.floor(googleTime / 3600);
  var minutes = Math.floor((googleTime - (hours * 3600)) / 60);
  var seconds = googleTime - (hours * 3600) - (minutes * 60);
  var actualTime ='';
  if (hours   < 10) {
    actualTime   = hours;
    this.setState({timeValueInText:'hr'})
  }
  if (minutes < 10) {
    actualTime = minutes;
    this.setState({timeValueInText:'min'})
  }
  if (seconds < 10) {
    actualTime = seconds;
    this.setState({timeValueInText:'sec'})
  }
  return actualTime;
}
/***********************Extra Functions***********************************/


}
