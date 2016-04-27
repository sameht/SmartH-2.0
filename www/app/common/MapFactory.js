appContext.factory('MapFactory', function($q){ 

	var getCurrentPosition=function () {
        var deferred = $q.defer();

      	if (!navigator.geolocation) {
          	deferred.reject('Geolocation not supported.');
     	} else {
          	navigator.geolocation.getCurrentPosition(
             	 function (position) {
                  	 var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                     deferred.resolve(latLng);
              	},
                function (err) {
                  deferred.reject(err);
                });
        }

        return deferred.promise;
    }
    /*------------function showGeocodedAddressOnMap-----------------*/

    var showGeocodedAddressOnMap = function(asDestination, markersArray,map) {
    	var destinationIcon = 'https://chart.googleapis.com/chart?' +
                'chst=d_map_pin_letter&chld=D|FF0000|000000';
        var originIcon = 'https://chart.googleapis.com/chart?' +
            'chst=d_map_pin_letter&chld=O|FFFF00|000000';
        /* Déclaration de l'objet qui définira les limites de la map */
        var bounds = new google.maps.LatLngBounds();


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
                //$ionicLoading.hide();
                console.error('Geocode was not successful due to: ' + status)
                alert('Geocode was not successful due to: ' + status);
            }
        };
    };
/*

    var getCurrentAddress= function (location) {
        var geocoder = new google.maps.Geocoder();

        geocoder.geocode({
        	'location': location
     	}, (function(results, status) {
     	       		if (status == google.maps.GeocoderStatus.OK) {
     	          	     console.log(results[0]);
     	            	$("#address").html(results[0].formatted_address);
     	        } else {
     	            alert('Geocode was not successful for the following reason: ' + status);
     	        }
     	     });
     	)
	}

	var  initialize= function () {
  		var myOptions = {
   	    zoom: 6,
        mapTypeId: google.maps.MapTypeId.ROADMAP
        };
    }

*/




	return{
		getCurrentPosition : getCurrentPosition,
		showGeocodedAddressOnMap : showGeocodedAddressOnMap
	}
})