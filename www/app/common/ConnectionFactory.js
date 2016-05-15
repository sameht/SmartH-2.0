appContext.factory('ConnectionFactory', function($http){ 
var isConnected = function(connectedCallBack, notConnectedCallBack) {

      //request options
       var testRequest = {
           method: 'GET',
           url: 'http://buzcard.fr/nepaseffacer.txt',
           timeout: 1500,
           params: { 
               'foobar': new Date().getTime() 
           },
       };
       
       // server call
       $http(testRequest).success(function(data, status, headers, config) {
           if (data == "OK") {
             //connected
                return connectedCallBack();
           } else {
              // not connected
               return notConnectedCallBack();
           }
       }).error(function(data, status, headers, config) {
           // error & not connected
           return notConnectedCallBack();
       });

 };

  return {
    isConnected : isConnected
  }
 
})