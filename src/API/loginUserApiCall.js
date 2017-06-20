var api = require('./api.js');

/***********Get User Balance********************************************/
module.exports.loginUserBalance = function(userEthereumAddress,callback){
  api.getUserBalance(userEthereumAddress, function(err,result){
       callback(err,result);
});
}

/***********Get User Profile********************************************/
module.exports.userProfileDataIPFS = function(userEthereumAddress,callback){
  api.getUserIPFSLink(userEthereumAddress, function(err,result){
      callback(err,result);
  });
}

module.exports.shopCall = function(userPrivateKey,callback){
  api.debugShop( userPrivateKey, function(err,result){
    if( err ) callback(err,false);
    else {
        tx = result;
        calltxStatusMethodForShop(tx,function(err,result)
        {
           callback(err,result);
        });
    }
});
}

calltxStatusMethodForShop = function(tx,callback)
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
