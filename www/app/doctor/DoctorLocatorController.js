appContext.controller('DoctorLocatorController', function($scope, $rootScope, $ionicLoading, PopupFactory, ConnectionFactory, $ionicPlatform, $cordovaGeolocation, DoctorLocatorFactory, $state) {
    console.warn('DoctorLocatorController')

    $ionicPlatform.ready(function() {

        if (window.cordova) {
            db = window.sqlitePlugin.openDatabase({
                name: "smartH",
                androidDatabaseImplementation: 2,
                location: 1
            }); // device
        } else {
            db = window.openDatabase("smartH", '1', 'desc', 1024 * 1024 * 5); // browser
            console.warn("created !")
        }


        $scope.searchByLocation = function(doctor) {
            
            if(doctor==undefined){
                $ionicLoading.show({
                    template: 'Vous devez introduire un champ',
                    duration: 2500
                });
            }else{
                // Setup the loader
                $ionicLoading.show({
                    content: 'Loading',
                    animation: 'fade-in',
                });

                ConnectionFactory.isConnected(function() {
                    DoctorLocatorFactory.emptyDoctorTable(db).then(function() {

                        var options = {timeout: 10000, enableHighAccuracy: false};
                        console.log("DoctorLocatorFactory.getCurrentPosition()....")
                        $cordovaGeolocation.getCurrentPosition(options).then(function(position){
      
                         var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                                $rootScope.latLng = latLng;
                                //console.log("latLng : "+latLng)
                                DoctorLocatorFactory.createDoctorTable(db).then(function(result) {
                                DoctorLocatorFactory.getDoctorListByDistance(parseInt(doctor.distance),doctor.region,doctor.ville, latLng);
                                
                  /*              if (array.length == 0) {
                                    console.log("pas de résultat")
                                    $ionicLoading.hide();
                                    $ionicLoading.show({
                                        template: 'Aucun médecin trouvé',
                                        duration: 3000
                                    });
                                } else {
                                    console.log("il y a de résultat")

                                    DoctorLocatorFactory.createDoctorTable(db).then(function(result) {
                                        DoctorLocatorFactory.insertBulkIntoDoctorTable(db, array).then(function(result) {
                                            $ionicLoading.hide();
                                            console.log($rootScope.isAuthenticated)
                                            if($rootScope.isAuthenticated==false){ // c'st un visiteur
                                                $state.go('visiteurMenu.resultDoctor')
                                            }else{
                                                $state.go('menu.resultDoctor')
                                            }
                                            

                                        }, function(error) {
                                            $ionicLoading.hide();
                                            console.log("erreur insertBulkIntoDoctorTable :" + error)

                                        })

                                    }, function(error) {
                                        $ionicLoading.hide();
                                        console.log("erreur createDoctorTable :" + error)
                                    })

                                }*/
                               
                                }, function(error) {
                                        $ionicLoading.hide();
                                        console.log("erreur createDoctorTable :" + error)
                                    })

                        },function(error){
                            //if faut activer le gps
                            $ionicLoading.hide();
                            PopupFactory.myPopup('Activez le gps pour determiner la recherche');
                            console.log("error "+error)
                            
                            //$ionicLoading.show({ template: 'activer le gps', duration:3000 });
                        })


                    }, function(erreur) {
                        $ionicLoading.hide();
                        console.log("erreur emptyDoctorTable :" + erreur)
                    });
                }, function() {
                    $ionicLoading.hide();
                    PopupFactory.myPopup('Utiliser les reseaux cellulaires et wifi pour determiner la recherche');
                    console.log("not connected");
                });

            }
            

        };




        
        $scope.search = function(doc) {
            // Setup the loader
            var doc2={name:"", lastname:"", specialty:"", gendre:""}
            if(doc==undefined){

               $ionicLoading.show({
                    template: 'Vous devez remplir au moins un champs',
                    duration: 4000
                });
            }else{
                for(var item in doc){
                    doc2[item]=doc[item]
                 
                }

            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
            });
            $rootScope.latLng = undefined
            ConnectionFactory.isConnected(function() {
                DoctorLocatorFactory.emptyDoctorTable(db).then(function() {
                    DoctorLocatorFactory.getDoctorList(doc2.name,doc2.lastname, doc2.specialty, doc2.gendre).success(function(data, status, headers, config) {
       console.log(data.length)
       var array=[]
        for(var i=0; i<data.length;i++){
          array.push({
             id : data[i].Id, 
              doctor: data[i].Nom+" "+data[i].Prenom,
             specialite:data[i].Specialite,
             sexe:data[i].Sexe,
             adresse :data[i].AdresseCabinet,
             tel:data[i].Tel,
             BD:data[i].DateNaissance
          })
        }
        
        console.log(data.length);
        console.log(array.length);
         console.log(array)
        /*********************************************************************************/


                    if (array.length == 0) {
                        console.log("pas de résultat")
                        $ionicLoading.hide();
                        $ionicLoading.show({
                            template: 'pas de résultat',
                            duration: 3000
                        });
                    } else {
                        console.log("il y a de résultat")

                        DoctorLocatorFactory.createDoctorTable(db).then(function(result) {
                            DoctorLocatorFactory.insertBulkIntoDoctorTable(db, array).then(function(result) {
                                console.log(array)
                                $ionicLoading.hide();
                                if($rootScope.isAuthenticated==false){ // c'est un visiteur
                                    $state.go('visiteurMenu.resultDoctor')
                                }else{
                                    $state.go('menu.resultDoctor')
                                }

                            }, function(error) {
                                $ionicLoading.hide();
                                console.log("erreur insertBulkIntoDoctorTable :" + error)

                            })

                        }, function(error) {
                            $ionicLoading.hide();
                            console.log("erreur createDoctorTable :" + error)
                        })

                    }


        }).error(function(data, status, headers, config) {
          
        });

                    

                }, function(erreur) {
                    $ionicLoading.hide();
                    console.log("erreur emptyDoctorTable :" + erreur)
                });
            //connection
            }, function() {
                $ionicLoading.hide();
                PopupFactory.myPopup('Utiliser les reseaux cellulaires et wifi pour determiner la recherche');
                console.log("not connected");
            });


        }
    //else    
    }
        //ionicplateform ready
    });

});