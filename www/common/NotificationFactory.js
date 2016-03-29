appContext.factory('NotificationFactory', function($cordovaLocalNotification){
     
        var singleNotification = function (ID,msg) {
          $cordovaLocalNotification.schedule({
            id: ID,
            title: 'Notification!',
            text: msg,
            data: {
              customProperty: 'custom value'
            }
          }).then(function (result) {
            console.log('Notification 1 triggered');
          });
        };

        var delayedNotification = function (ID,msg) {
          var now = new Date().getTime();
          var _10SecondsFromNow = new Date(now + 10 * 1000);
 
          $cordovaLocalNotification.schedule({
            id: ID,
            title: 'Rappel',
            text: msg,
            at: _10SecondsFromNow
          }).then(function (result) {
            console.log('Notification 2 triggered');
          });
        };
 
        var everyMinuteNotification = function () {
          $cordovaLocalNotification.schedule({
            id: 3,
            title: 'Warning',
            text: 'Dont fall asleep',
            every: 'minute'
          }).then(function (result) {
            console.log('Notification 3 triggered');
          });
        };      
         
        var updateSingleNotification = function () {
          $cordovaLocalNotification.update({
            id: 2,
            title: 'Warning Update',
            text: 'This is updated text!'
          }).then(function (result) {
            console.log('Notification 1 Updated');
          });
        };  
 
        var cancelSingleNotification = function () {
          $cordovaLocalNotification.cancel(3).then(function (result) {
            console.log('Notification 3 Canceled');
          });
        };  

        return {
        	singleNotification :singleNotification ,
        	delayedNotification : delayedNotification ,
        	everyMinuteNotification : everyMinuteNotification,
        	updateSingleNotification : updateSingleNotification,
        	cancelSingleNotification :cancelSingleNotification
        }

})