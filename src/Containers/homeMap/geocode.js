import {Platform, Alert} from 'react-native'
import Geocoder from 'react-native-geocoding';

let GeocodeCall =
{

getAddressFromLatLng(lat, lng){
  return Geocoder.getFromLatLng(lat,lng).then(json => {
    return json;
    },
    error => {
      Alert.alert("Something went wrong getting address" + error);
    }
  );
},

getLatLngFromAddress(address){
  return  Geocoder.getFromLocation(address).then(json => {
    return json;
    },
    error => {
      Alert.alert("Something went wrong getting location" + error);
    }
  );
}

}

module.exports = GeocodeCall
