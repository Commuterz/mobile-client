var api = require('./api.js');

/************Getting Ride Id When Requesting a ride*************/
module.exports.nextRideId = function(userEthereumAddress, callback){
  api.getNextRideId(userEthereumAddress, function(err,result){
    if( err ) console.log(err,false);
    else {
        console.log("ride id: " + result.toString(16));
        callback(err,result);
    }
});
}
/**************Ride Request********************************************/
module.exports.rideRequest = function(userPrivateKey,rideCost,callback){
  api.userRequestARide( userPrivateKey, rideCost, function(err,result){
    if( err ) console.log(err,false);
    else {
        tx = result;
        calltxStatusMethodForPassangerRequestARide(tx,function(err,result)
        {
           callback(err,result);
        });
    }
});
}


/******************Rate for Driver****************************************************/
module.exports.rateByRider = function(userPrivateKey,rideId,userRating,callback){
  api.userRate( userPrivateKey, rideId, userRating, function(err,result){
      if( err )console.log(err,false);
      else {
          tx = result;
          console.log(tx);
          calltxStatusMethodForDriverRequest(tx,function(err,result)
          {
             callback(err,result);
          });
      }
  });
}

/******************Call Status for TX at Rider Side****************************************************/
calltxStatusMethodForPassangerRequestARide = function(tx,callback)
{
     var self = this
      api.txStatus( tx, function(err,result){
       if( err ) console.log(err,false);
       tx_confirmed = result;
       if( tx_confirmed ) {
           console.log("confirmed")
            callback(err,result);
       }
       else {
          console.log("not confirmed" );
          setTimeout(() => {
            calltxStatusMethodForPassangerRequestARide(tx,function(err,result){
              if(result === true)
              {
                 callback(err,result);
              }
            })
          }, 100);

       }
    });
}
