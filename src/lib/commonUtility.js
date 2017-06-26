
module.exports.getDistanceFromLatLonInKm = function(lat1,lon1,lat2,lon2,callback){

var R = 6371; // Radius of the earth in km
 var deg1 = lat2-lat1;  // deg2rad below
 var deg2 = lon2-lon1;
 var dLat = deg1 * Math.PI/180;
 var dLong = deg2 * Math.PI/180;
 var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
   Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
   Math.sin(dLong / 2) * Math.sin(dLong / 2);

 var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
 var d = R * c; // Distance in km
 //for miles d = d*0.621371;
  callback(d);
}


module.exports.getDistanceFromLatLonInMiles = function(lat1,lon1,lat2,lon2,callback){

var R = 6371; // Radius of the earth in km
 var deg1 = lat2-lat1;  // deg2rad below
 var deg2 = lon2-lon1;
 var dLat = deg1 * Math.PI/180;
 var dLong = deg2 * Math.PI/180;
 var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
   Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
   Math.sin(dLong / 2) * Math.sin(dLong / 2);
 var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
 var d = R * c; // Distance in km
 var miles = d * 0.62137; //distance in miles
 callback(miles);
}
