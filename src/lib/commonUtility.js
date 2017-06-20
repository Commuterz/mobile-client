
module.exports.getDistanceFromLatLonInKm = function(lat1,lon1,lat2,lon2,callback){
  var R = 6378137; // Earth’s mean radius in meter
  var deg1 = lat2-lat1;
  var deg2 = lon2-lon1;
  var dLat = deg1 * Math.PI/180;
  var dLong = deg2 * Math.PI/180;
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // returns the distance in meter
  callback(d);
}
