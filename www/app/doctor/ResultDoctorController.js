appContext.controller('ResultDoctorController', function($scope, $ionicHistory, $rootScope, $ionicPlatform, DoctorLocatorFactory, $state, $cordovaGeolocation, $ionicLoading, PopupFactory, ConnectionFactory) {
    console.warn('ResultDoctorController')

    $scope.goToDoctor=function(id){
      if($rootScope.isAuthenticated==false){
        
         $state.go('visiteurMenu.doctor', {id: id });
       }else{
        // $state.go("menu.doctor"+id)
         $state.go('menu.doctor', {id: id });
       }
     
    }
    $ionicPlatform.ready(function() {
        // Setup the loader
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
        });


        /*************  BD ********************/
        if (window.cordova) {
            db = window.sqlitePlugin.openDatabase({
                name: "smartH",
                androidDatabaseImplementation: 2,
                location: 1
            }); // device
        } else {
            db = window.openDatabase("smartH", '1', 'desc', 1024 * 1024 * 5); // browser
        }


        /************ get Doctor listfrom local db *******************/

        DoctorLocatorFactory.getDoctorLocalList(db).then(function(result) {
            var array = [];
            for (var i = 0; i < result.rows.length; i++) {
                array[i] = result.rows.item(i);
            };
            $scope.doctorArray = array;
            console.log($scope.doctorArray)
            /*----------------------------------------------*/
            /*---------------------map-----------------------*/
            var bounds = new google.maps.LatLngBounds;
            var markersArray = [];
            var infoWindowArray = [];

            var destArray = $scope.doctorArray;

            var destinationIcon = 'https://chart.googleapis.com/chart?' +
                'chst=d_map_pin_letter&chld=D|FF0000|000000';
            var originIcon = 'https://chart.googleapis.com/chart?' +
                'chst=d_map_pin_letter&chld=O|FFFF00|000000';

            var map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: 55.53, lng: 9.4},
                zoom: 10
            });

            var geocoder = new google.maps.Geocoder;

            var originList = [$rootScope.latLng ];
            var destinationList = $scope.doctorArray;;

            deleteMarkers(markersArray);
            /*----------------------------------------------*/
            var showGeocodedAddressOnMap = function(asDestination,doc) {
                var icon = asDestination ? destinationIcon : originIcon;
                return function(results, status) {
                  if (status === google.maps.GeocoderStatus.OK) {
                    map.fitBounds(bounds.extend(results[0].geometry.location));
                    markersArray.push(new google.maps.Marker({
                      map: map,
                      position: results[0].geometry.location,
                      animation: google.maps.Animation.DROP,
                      icon: icon
                    }));

                    if(doc!=undefined){
                      var contentString="Doctor : "+doc.doctor+"<br/>Spécialité : "+doc.specialite ;
                    }else{
                      var contentString="Ma position"
                    }

                    var arraylength=markersArray.length;
                    
                    infoWindowArray.push(new google.maps.InfoWindow({
                      content: contentString
                    }));

                       markersArray[arraylength-1].addListener('click', function() {
                        for(var i =0; i<infoWindowArray.length; i++){
                          infoWindowArray[i].close();
                        }
                        infoWindowArray[arraylength-1].open(map,markersArray[arraylength-1]);
                      });

                  } else {
                    $ionicLoading.hide();
                    alert('Geocode was not successful due to: ' + status);
                  }
                };
            };
          /*----------------------------------------------*/
        if ($rootScope.latLng != undefined) {
        geocoder.geocode({'location': originList[0]},
            showGeocodedAddressOnMap(false));
            $ionicLoading.hide();
        }else{
            $ionicLoading.hide();
            console.info("current position is not defined")
        }


        for (var i = 0; i < destinationList.length; i++) {
            geocoder.geocode({'address': destinationList[i].adresse},
            showGeocodedAddressOnMap(true,$scope.doctorArray[i]));
            console.log($scope.doctorArray[i].doctor)
        };




        /*----------------------------------------------*/
        function deleteMarkers(markersArray) {
          for (var i = 0; i < markersArray.length; i++) {
            markersArray[i].setMap(null);
            infoWindowArray[i].setMap(null)
          }
          markersArray = [];
          infoWindowArray=[];
        }
        /*-------------------------------------------*/


            /************ fin :  get Doctor listfrom local db *************/
        }, function(error) {
            $ionicLoading.hide();
            console.log("error getDoctorLocalList : " + error)
        })


    })

});


























/*
      function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[1]) {
            map.setZoom(11);
            var marker = new google.maps.Marker({
              position: $rootScope.latLng,
              map: map, 
              icon : originIcon
            });
            console.log("results[1].formatted_address : "+results[1].formatted_address)
        $ionicLoading.hide();

          } else {
            $ionicLoading.hide();
            console.error('No results found')
            window.alert('No results found');
          }
        } else {
          $ionicLoading.hide();
          console.error('Geocoder failed due to: ' + status)
          window.alert('Geocoder failed due to: ' + status);
        }
      }*/