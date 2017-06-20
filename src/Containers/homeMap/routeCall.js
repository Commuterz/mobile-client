import webAPICall from '@API/webAPICall'
import {Platform, Alert} from 'react-native'

const routeURL='https://maps.googleapis.com/maps/api/directions/json?origin=';
const routeKEY='AIzaSyAZKNjTsWG_xTocHqtqRG5zClro6mR15Qk';


module.exports.findRouteBtwSourceAnDestination = function(toLoc,fromLoc,callback){
  var URL =  routeURL+ toLoc +"&destination="+fromLoc+ "&units=imperial&mode=driving&key="+routeKEY+""
  webAPICall.getApi(URL,'GET').then((responseJson) =>  {
      callback(responseJson);
  })
  .done();
}

module.exports.findRouteBtwSourceAnDestinationWithWayPoint = function(toLoc,fromLoc,riderWayPoint,callback){
  var URL =  routeURL+ toLoc +"&destination="+fromLoc+ "&waypoints=optimize:true|" +riderWayPoint+ "&units=imperial&mode=driving&key="+routeKEY+""
  webAPICall.getApi(URL,'GET').then((responseJson) =>  {
      callback(responseJson);
  })
  .done();
}

module.exports.decodePolyline = function(str,precision,callback){
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
    callback(coordinates);
}
