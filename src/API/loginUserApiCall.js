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
