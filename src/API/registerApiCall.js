var api = require('./api.js');
import {Alert} from 'react-native';


module.exports.userPrivateKey = function(userPassword,userSalt,callback){
  var userPrivateKey = api.getPrivateKey(userPassword, userSalt);
  callback(userPrivateKey)
}

module.exports.privateKeyAddress = function(userPrivateKey,callback){
    api.privateKeyToAddress(userPrivateKey, function(result){
        callback(result);
    });
}

module.exports.etherInRegistration = function (userEthereumAddress,callback ) {
    api.getSomeEtherInRegistration(userEthereumAddress,function(err,result){
         if( err ) callback(err,'false');
        else {
            var tx = result;
            calltxStatusMethodForRequest(tx,function(err,result)
            {
               callback(err,result);
            });
        }
    });
}

/***********Check if user already registered ********************************************/
module.exports.isAlreadyRegistered = function(userEthereumAddress,callback){
  api.isRegistered( userEthereumAddress, function(err,result){
    if( err )  callback(err,'false');
    else {
        console.log( "user 2 registered = " + result);
        callback(err,result);
    }
});
}

/***********Check if user already registered ********************************************/
module.exports.registerUser = function(userPrivateKey,userIpfs,callback){
  api.register( userPrivateKey, userIpfs, function(err,result){
      if( err ) callback(err,'false');
      else {
          var tx = result;
          console.log(tx);
          calltxStatusMethodForRequest(tx,function(err,result)
          {
             callback(err,result);
          });
      }
  });
}

/***********Check if user already registered ********************************************/
module.exports.approveTokenForRegisterUser = function(userPrivateKey,cost,callback){
  console.warn('approveTokenForRegisterUser inside' +userPrivateKey + " ==" +cost)
  api.approveTokensToContract( userPrivateKey, cost, function(err,result){
    if( err )  callback(err,'false');
    else {
        var tx = result;
        console.log(tx);
        calltxStatusMethodForRequest(tx,function(err,result)
        {
           callback(err,result);
        });
    }
});
}



/***********tx method to get confirmations ********************************************/
calltxStatusMethodForRequest = function(tx,callback)
{
     var self = this
     api.txStatus( tx, function(err,result){
      if( err )  callback(err,result);
      var tx_confirmed = result;
       if( tx_confirmed ) {
           console.log("confirmed")
           callback(err,result);
       }
       else {
          console.log("not confirmed");
          setTimeout(() => {
            calltxStatusMethodForRequest(tx,function(err,result){
              if(result === true)
              {
                 callback(err,result);
              }
            })
          }, 100);

       }
    });
}
