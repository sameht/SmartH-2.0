appContext.controller('ResultDoctorController', function($scope, $state, $cordovaGeolocation) {
  console.log("map");

/****************     Map     ******************/
   var options = {timeout: 10000, enableHighAccuracy: true};
 
  $cordovaGeolocation.getCurrentPosition(options).then(function(position){
 
    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
 
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
 
  }, function(error){
    console.log("Could not get location");
  });
  /*****************************************************/
/****************    List     ******************/
    $scope.doctorArray=[];

    
  for(var i=0 ;i<=5 ;i++){
    $scope.doctorArray[i]={doctor : "doctor "+(i+1),specialty:"dermatologue" ,address :'teboulba'}
  }

});