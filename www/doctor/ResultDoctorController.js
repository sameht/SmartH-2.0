appContext.controller('ResultDoctorController', function($scope, $state, $cordovaGeolocation, $ionicLoading,PopupFactory, ConnectionFactory) {

  //check network connection
  ConnectionFactory.isConnected(

    function(connectedCallBack){
       console.log("connected");
          // Setup the loader
          $ionicLoading.show({
             content: 'Loading',
             animation: 'fade-in',
          });

         console.log("map");

        /****************     Map     ******************/
         var options = {timeout: 10000, enableHighAccuracy: false};
       
        $cordovaGeolocation.getCurrentPosition(options).then(function(position){
       
          var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
       
          var mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };
       
          $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
          
          //Wait until the map is loaded
          google.maps.event.addListenerOnce($scope.map, 'idle', function(){
           
            var marker = new google.maps.Marker({
                map: $scope.map,
                animation: google.maps.Animation.DROP,
                position: latLng
            });      
             // info Window
            var infoWindow = new google.maps.InfoWindow({
                content: "Here <br/> I am!"
            });
           
            google.maps.event.addListener(marker, 'click', function () {
                infoWindow.open($scope.map, marker);
            });
           
          });

          $ionicLoading.hide();

        }, function(error){
          $ionicLoading.hide();
          console.log("Could not get location");
          $ionicLoading.show({  template: 'Could not get location , activez le GPS',  duration: 1700 });
        });
    }

    , function(notConnectedCallBack){
       PopupFactory.myPopup('Utiliser le GPS ainsi que les reseaux cellulaires et wifi pour determiner la position');
       console.log("not connected");
    }

  );


  /*****************************************************/


/****************    List     ******************/
    $scope.doctorArray=[];

    
  for(var i=0 ;i<=5 ;i++){
    $scope.doctorArray[i]={doctor : "doctor "+(i+1),specialty:"dermatologue" ,address :'teboulba'}
  }

});