appContext.factory('NotificationFactory', function($cordovaLocalNotification, $state){
     
        var singleNotification = function (ID,msg) {
          $cordovaLocalNotification.schedule({
            id: ID,
            title: 'Notification!',
            text: msg,
            icon: "img/icon.pnj",
            data: {
              customProperty: 'custom value'
            }
          }).then(function (result) {
            console.log('Notification 1 triggered');
          });

          cordova.plugins.notification.local.on("click", function (notification, state) {
              console.log("notification 1 was clicked");
              $state.go("menu.rdv");
          }, this)
        };

        var delayedNotification = function (ID,msg) {
          var now = new Date().getTime();
          var _10SecondsFromNow = new Date(now + 10 * 1000);
 
          $cordovaLocalNotification.schedule({
            id: ID,
            title: 'Rappel',
            text: msg,
            icon: "img/icon.pnj",
            at: _10SecondsFromNow
          }).then(function (result) {
            console.log('Notification 2 triggered');
          });
          cordova.plugins.notification.local.on("trigger", function(notification) {
              alert("triggered: 11111" );
          });

          cordova.plugins.notification.local.on("click", function (notification, state) {
              console.log("notification 2 was clicked");
              $state.go("menu.listRdv");
          }, this)

        };
 
        var everyMinuteNotification = function () {
          $cordovaLocalNotification.schedule({
            id: 3,
            title: 'Warning',
            text: 'Dont fall asleep',
            icon: "img/icon.pnj",
            every: 'minute'
          }).then(function (result) {
            console.log('Notification 3 triggered');
          });

          cordova.plugins.notification.local.on("click", function (notification, state) {
              console.log("notification 1 was clicked");
              $state.go("menu.listRdv");
          }, this)
        };      
         
        var updateSingleNotification = function (ID, Interval,msg) {
          var now = new Date().getTime();
          var SecondsFromNow = new Date(now + Interval * 1000);

          $cordovaLocalNotification.update({
            id: ID,
            title: 'Warning Update',
            text: msg,
            icon: "img/icon.pnj",
            at: SecondsFromNow
          }).then(function (result) {
            console.log('Notification 1 Updated');
          });
        };  
 
        var cancelSingleNotification = function (ID) {
          $cordovaLocalNotification.cancel(ID).then(function (result) {
            console.log('Notification 3 Canceled');
          });
        };  

        var PresentNotification = function (ID) {
          $cordovaLocalNotification.isPresent(ID).then(function (present) {
            return present ;
          })
        }; 


      
        return {
        	singleNotification :singleNotification ,
        	delayedNotification : delayedNotification ,
        	everyMinuteNotification : everyMinuteNotification,
        	updateSingleNotification : updateSingleNotification,
        	cancelSingleNotification :cancelSingleNotification,
          PresentNotification : PresentNotification
        }

})