var api = require('./api.js');


module.exports.passangerRequestARide =  function ( amount,callback ) {

    api.passangerRequestARide(amount,function(err,result){
      if( err ) callback(err,result);
      else {
          tx = result;
          console.log('tx result' + tx);
          calltxStatusMethodForPassangerRequestARide(tx,function(err,result)
          {
             callback(err,result);
          });
        }
    });

 };

 module.exports.riderPaysContract =  function ( amount,callback ) {
     api.riderPaysContract(rideCost,function(err,result){
        if( err ) console.log(err);
        else {
            tx = result;
            console.log(tx);
            calltxStatusMethodForPassangerRequestARide(tx,function(err,result)
            {
               callback(err,result);
            });
        }
    });
};



calltxStatusMethodForPassangerRequestARide = function(tx,callback)
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
