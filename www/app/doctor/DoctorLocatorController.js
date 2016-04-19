appContext.controller('DoctorLocatorController', function($scope,$rootScope,PopupFactory, ConnectionFactory,$ionicPlatform, $cordovaGeolocation,DoctorLocatorFactory, $state){
   
    $ionicPlatform.ready(function() {
	     
        if (window.cordova) {
            db = window.sqlitePlugin.openDatabase({name : "smartH" , androidDatabaseImplementation: 2, location: 1}); // device
        } else {
            db = window.openDatabase("smartH", '1', 'desc', 1024 * 1024 * 5); // browser

        }


      
      $scope.rechercher=function(localisation){
      	ConnectionFactory.isConnected( function(connectedCallBack){
      		DoctorLocatorFactory.emptyDoctorTable(db).then(function(){

      		var DocNb=0;
      		var DocArray=[];
	      	
		    var array=DoctorLocatorFactory.getDoctorList();

	    	var options = {timeout: 10000, enableHighAccuracy: false};
	        $cordovaGeolocation.getCurrentPosition(options).then(function(position){

	        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	            $rootScope.latLng=latLng;
	            var i=0;
	            for (i = 0; i < array.length; i++) {
		    		//console.log(array[i].adresse+' '+i)
		    		DoctorLocatorFactory.calculateDistance(latLng,array[i]).then(function(result){
		    			
		    			var doc=result
		    			//ajouter la valeur de distance 
		    			console.log(parseInt(localisation.distance));
		    			
		    			if(doc.distance < parseInt(localisation.distance)){
		    			    DocNb=DocNb+1;
		    			    DoctorLocatorFactory.createDoctorTable(db).then(function(result){
 	    			         	DoctorLocatorFactory.setDoctor(db,doc).then(function(result){
 	    			         		console.log(DocNb)
 	    			         		if (i==array.length-1) {
 	    			         			console.log("======> résultat")
 	    			         			$state.go('menu.resultDoctor');
 	    			         		}
	 	    			        },function(reason){
	 	    			         	console.log("error setDoctor"+reason)
	 	    			        })
		    			     
		    			    },function(reason){
		    			      console.log("error createDoctorTable"+reason)
		    			    })

		    			};
		    		},function(reason){
		    			console.log("erreur calculateDistance : "+reason)
		    		})

					if(DocNb==0 && i==array.length-1){
		    			console.log("aucune résultat")
		    		}
	    		};
	    	
	    		

	         },function(error){
	    		console.log("erreur getCurrentPosition :" +error)
	         });

		    },function(erreur){
      			console.log("erreur emptyDoctorTable :" +erreur)
      		});
	   }, function(notConnectedCallBack){
        PopupFactory.myPopup('Utiliser les reseaux cellulaires et wifi pour determiner la recherche');
        console.log("not connected");
    	})
		

      }


    //ionicplateform ready
	},function(error){

	})

})

