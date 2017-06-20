var api = require('./api.js');


// // 1) get notification from rider that he invited a ride
// // from the notification set rideId and rideCost
// var rideId = "0x124";
// var rideCost = 3;

/*******************Driver Approve ride request****************************************************/
module.exports.rideApproveByDriver = function(userPrivateKey,rideId,callback){
  api.userApproveARideByDriver( userPrivateKey, rideId, function(err,result){
    if( err ) console.log(err,false);
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


/******************Ride End By Driver****************************************************/
module.exports.rideEndByDriver = function(userPrivateKey,rideId,callback){
  api.userEndsRideByDriver( userPrivateKey, rideId, function(err,result){
    if( err ) console.log(err,false);
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

/******************Rate for Driver****************************************************/
module.exports.rateByDriver = function(userPrivateKey,rideId,userRating,callback){
  api.userRate( userPrivateKey, rideId, userRating, function(err,result){
      if( err ) console.log(err,false);
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


/******************Call Status Tx for Driver Request***************************************************/
calltxStatusMethodForDriverRequest = function(tx,callback)
{
     var self = this
      api.txStatus( tx, function(err,result){
       if( err )console.log(err,false);
       tx_confirmed = result;
       if( tx_confirmed ) {
           console.log("confirmed")
            callback(err,result);
       }
       else {
          console.log("not confirmed");
          setTimeout(() => {
            calltxStatusMethodForDriverRequest(tx,function(err,result){
              if(result === true)
              {
                 callback(err,result);
              }
            })
          }, 100);

       }
    });
}
