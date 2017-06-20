var api = require('./api.js');


// // 1) get notification from rider that he invited a ride
// // from the notification set rideId and rideCost
// var rideId = "0x124";
// var rideCost = 3;

module.exports.driverPaysContract = function (rideId,callback ) {

    api.driverPaysContract(rideId,function(err,result){
        if( err ) console.log(err);
        else {
            tx = result;
            console.log(tx);
            calltxStatusMethodForDriverRequest(tx,function(err,result)
            {
               callback(err,result);
            });
        }
    });
};

module.exports.driverApproveARide =  function (rideId,callback ) {
    api.driverApproveARide(rideId,function(err,result){
        if( err ) console.log(err);
        else {
            tx = result;
            console.log(tx);
            calltxStatusMethodForDriverRequest(tx,function(err,result)
            {
               callback(err,result);
            });
        }
    });
};

module.exports.driverEndsRide =  function ( amount,callback ) {
    api.driverEndsRide(rideId,function(err,result){
        if( err ) console.log(err);
        else {
            tx = result;
            console.log(tx);
            calltxStatusMethodForDriverRequest(tx,function(err,result)
            {
               callback(err,result);
            });
        }
    });
};


calltxStatusMethodForDriverRequest = function(tx,callback)
{
     var self = this
      api.txStatus( tx, function(err,result){
       if( err ) console.log(err)
       tx_confirmed = result;
       if( tx_confirmed ) {
           console.log("confirmed")
            callback(err,result);
       }
       else {
          console.log("not confirmed");
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
