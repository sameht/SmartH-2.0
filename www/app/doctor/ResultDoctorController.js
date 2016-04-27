appContext.controller('ResultDoctorController', function($scope, $ionicHistory, $rootScope, $ionicPlatform, DoctorLocatorFactory, $state, $cordovaGeolocation, $ionicLoading, PopupFactory, ConnectionFactory) {
    console.warn('ResultDoctorController')


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
            // console.log( $scope.doctorArray[0])
            /******************map *********************/
            var markersArray = [];
            /* Déclaration de l'objet qui définira les limites de la map */
            var bounds = new google.maps.LatLngBounds();
            //   var latLng = {lat: 50.087, lng: 14.421};
            var destinationA = "Aéroport international de Tunis-Carthage, Tunis, Gouvernorat de Tunis";
            var destinationB = "Maison des Jeunes Djerba Midoun, Djerba Midun, Médenine";
            var destArray = $scope.doctorArray;
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

            /*------------function deleteMarkers-----------------*/
            var  deleteMarkers= function(markersArray) {
                for (var i = 0; i < markersArray.length; i++) {
                    markersArray[i].setMap(null);
                }
                console.log("ggggggggggggggggg")
                markersArray = [];
                console.log(markersArray)
            }
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

                       /* google.maps.event.addListener(markersArray[markersArray.length - 1], 'click', function() {
                            infoWindow.open(map, markersArray[markersArray.length - 1]);
                            console.log(markersArray)
                        });*/
                    } else {
                        $ionicLoading.hide();
                        console.error('Geocode was not successful due to: ' + status)
                        alert('Geocode was not successful due to: ' + status);
                    }
                };
            };
            /*-------------------------------------------------------------*/
            deleteMarkers(markersArray);

            if ($rootScope.latLng != undefined) {
                //show current position marker markers
                console.log($rootScope.latLng);
                geocoder.geocode({
                    'location': $rootScope.latLng
                }, showGeocodedAddressOnMap(false));
                $ionicLoading.hide();
            } else {
                $ionicLoading.hide();
                console.info("current position is not defined")
            }


            //show doctor markers
            for (var i = 0; i < destArray.length; i++) {
                geocoder.geocode({
                    'address': destArray[i].adresse
                }, showGeocodedAddressOnMap(true));
            };
            console.log(markersArray)
            /******************fin map *********************/

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