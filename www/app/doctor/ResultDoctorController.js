appContext.controller('ResultDoctorController', function($scope,$rootScope,$ionicPlatform, DoctorLocatorFactory, $state, $cordovaGeolocation, $ionicLoading,PopupFactory, ConnectionFactory) {
  
   $scope.doctorArray=[]
  $ionicPlatform.ready(function() {
      /*************  BD ********************/ 
      if (window.cordova) {
        db = window.sqlitePlugin.openDatabase({name : "smartH" , androidDatabaseImplementation: 2, location: 1}); // device
      } else {
          db = window.openDatabase("smartH", '1', 'desc', 1024 * 1024 * 5); // browser
      }
      /************ get Doctor listfrom local db *******************/
      DoctorLocatorFactory.getDoctorLocalList(db).then(function(result){
         
        for (var i = 0; i < result.rows.length; i++) {
          $scope.doctorArray.push(result.rows[i]);
        };
         // console.log( $scope.doctorArray[0])
      /******************map *********************/
      var markersArray = [];
      /* Déclaration de l'objet qui définira les limites de la map */ 
       var bounds = new google.maps.LatLngBounds();
       var latLng = {lat: 50.087, lng: 14.421};
       var destinationA="Aéroport international de Tunis-Carthage, Tunis, Gouvernorat de Tunis";
       var destinationB = "Maison des Jeunes Djerba Midoun, Djerba Midun, Médenine";
       var destArray= $scope.doctorArray;
       var destinationIcon = 'https://chart.googleapis.com/chart?' +
      'chst=d_map_pin_letter&chld=D|FF0000|000000';
       var originIcon = 'https://chart.googleapis.com/chart?' +
       'chst=d_map_pin_letter&chld=O|FFFF00|000000';

      // create the map that will be displayed on view
      var map = new google.maps.Map(document.getElementById('map'), {
           /* center: {lat: 55.53, lng: 9.4},
            zoom: 10*/
             mapTypeId: google.maps.MapTypeId.ROADMAP
          });
      //convertir des adresses "string" en coordonnées géographiques 
      var geocoder = new google.maps.Geocoder();

      /*------------function showGeocodedAddressOnMap-----------------*/
       
      var showGeocodedAddressOnMap = function(asDestination) {
            var icon = asDestination ? destinationIcon : originIcon; //if adDestination=false :icon=originIcon
            return function(results, status) {
              if (status === google.maps.GeocoderStatus.OK) {
                map.fitBounds(bounds.extend(results[0].geometry.location));
                markersArray.push(new google.maps.Marker({
                  map: map,
                  position: results[0].geometry.location,
                   animation: google.maps.Animation.DROP,
                  icon: icon
                }));

                 // info Window
                var infoWindow = new google.maps.InfoWindow({
                    content: "Here <br/> I am!"
                });
               
                google.maps.event.addListener(markersArray[markersArray.length-1], 'click', function () {
                    infoWindow.open(map, markersArray[markersArray.length-1]);
                });   
              } else {
                alert('Geocode was not successful due to: ' + status);
              }
            };
    };
    /*-------------------------------------------------------------*/
    //show all markers
      for (var i = 0; i < destArray.length; i++) {
        geocoder.geocode({'address': destArray[i].adresse}, showGeocodedAddressOnMap(true)); 

      };

      /******************fin map *********************/

      /************ fin :  get Doctor listfrom local db *************/
     },function(error){
        console.log("error getDoctorLocalList : "+error)
      })
 
     
  },function(error){
    console.log("error ionicPlatform ready")
  })

});



      