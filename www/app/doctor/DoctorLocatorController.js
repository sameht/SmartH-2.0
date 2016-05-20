appContext.controller('DoctorLocatorController', function($scope, $rootScope, $ionicLoading, PopupFactory, ConnectionFactory, $ionicPlatform, $cordovaGeolocation, DoctorLocatorFactory, $state, ionicToast) {
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

        var options = {
            timeout: 10000,
            enableHighAccuracy: false
        };

        $cordovaGeolocation.getCurrentPosition(options).then(function(position) {

            var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            $rootScope.latLng = latLng;
        }, function(error) {
            //if faut activer le gps
            $ionicLoading.hide();
            PopupFactory.myPopup('Activez le gps pour determiner la recherche');
            console.log("error " + error)

            //$ionicLoading.show({ template: 'activer le gps', duration:3000 });
        })

        //ionicplateform ready
    });

    $scope.searchByLocation = function(doctor) {
        var doc1 = {
            distance: "",
            region: "",
            ville: ""
        }

        /******------------------------------------******/
        if (doctor == undefined) {
            $ionicLoading.show({
                template: 'Vous devez introduire un champ',
                duration: 1500
            });
        } else {


            for (var item in doctor) {
                doc1[item] = doctor[item]
            }

            // Setup the loader
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
            });

            ConnectionFactory.isConnected(function() {


                DoctorLocatorFactory.ifTableExist(db).then(function(exist) {

                    if (exist) {

                        DoctorLocatorFactory.emptyDoctorTable(db).then(function() {

                            var options = {
                                timeout: 10000,
                                enableHighAccuracy: false
                            };
                            console.log("DoctorLocatorFactory.getCurrentPosition()....")
                            $cordovaGeolocation.getCurrentPosition(options).then(function(position) {

                                var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                                $rootScope.latLng = latLng;
                                //console.log("latLng : "+latLng)
                                DoctorLocatorFactory.createDoctorTable(db).then(function(result) {
                                    DoctorLocatorFactory.getDoctorListByDistance(parseInt(doc1.distance), doc1.region, doc1.ville, latLng, function() {
                                        $ionicLoading.hide();
                                        console.log($rootScope.isAuthenticated)
                                        if ($rootScope.isAuthenticated == false) { // c'est un visiteur
                                            $state.go('visiteurMenu.resultDoctor')
                                        } else {
                                            $state.go('menu.resultDoctor')
                                        }
                                    });


                                }, function(error) {
                                    $ionicLoading.hide();
                                    console.log("erreur createDoctorTable :" + error)
                                })

                            }, function(error) {
                                //if faut activer le gps
                                $ionicLoading.hide();
                                PopupFactory.myPopup('Activez le gps pour determiner la recherche');
                                console.log("error " + error)

                                //$ionicLoading.show({ template: 'activer le gps', duration:3000 });
                            })


                        }, function(erreur) {
                            $ionicLoading.hide();
                            console.log("erreur emptyDoctorTable :" + erreur)
                        });

                    } else {

                        /********************************************************************/

                        /**
                         * get All doctors from server
                         */

                        DoctorLocatorFactory.getDoctorList().success(function(data, status, headers, config) {

                            var array = []
                            for (var i = 0; i < data.length; i++) {
                                array.push({
                                    id: data[i].Id,
                                    name: data[i].Nom,
                                    lastname: data[i].Prenom,
                                    specialite: data[i].IdSpecialite,
                                    sexe: data[i].Sexe,
                                    adresse: data[i].Adresse, // Id de cabinet
                                    tel: data[i].Tel,
                                    BD: data[i].DateNaissance
                                })
                            }

                            DoctorLocatorFactory.createAllDoctorsTable(db).then(function() {

                                DoctorLocatorFactory.insertBulkIntoAllDoctorsTable(db, array).then(function(result) {

                                    DoctorLocatorFactory.emptyDoctorTable(db).then(function() {

                                        var options = {
                                            timeout: 10000,
                                            enableHighAccuracy: false
                                        };
                                        console.log("DoctorLocatorFactory.getCurrentPosition()....")
                                        $cordovaGeolocation.getCurrentPosition(options).then(function(position) {

                                            var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                                            $rootScope.latLng = latLng;
                                            //console.log("latLng : "+latLng)
                                            DoctorLocatorFactory.createDoctorTable(db).then(function(result) {
                                                DoctorLocatorFactory.getDoctorListByDistance(parseInt(doctor.distance), doctor.region, doctor.ville, latLng, function() {
                                                    $ionicLoading.hide();
                                                    console.log($rootScope.isAuthenticated)
                                                    if ($rootScope.isAuthenticated == false) { // c'st un visiteur
                                                        $state.go('visiteurMenu.resultDoctor')
                                                    } else {
                                                        $state.go('menu.resultDoctor')
                                                    }
                                                });


                                            }, function(error) {
                                                $ionicLoading.hide();
                                                console.log("erreur createDoctorTable :" + error)
                                            })

                                        }, function(error) {
                                            //if faut activer le gps
                                            $ionicLoading.hide();
                                            PopupFactory.myPopup('Activez le gps pour determiner la recherche');
                                            console.log("error " + error)

                                            //$ionicLoading.show({ template: 'activer le gps', duration:3000 });
                                        })


                                    }, function(erreur) {
                                        $ionicLoading.hide();
                                        console.log("erreur emptyDoctorTable :" + erreur)
                                    });
                                });
                            });




                        }).error(function(data, status, headers, config) {
                            ionicToast.show('Une erreur serveur est servenue', 'top', false, 2500);
                            setTimeout(function() {
                                ionic.Platform.exitApp()
                            }, 2600);
                        })


                    };

                }, function() {

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
        var doc2 = {

        }
        if (doc == undefined) {

            $ionicLoading.show({
                template: 'Vous devez remplir au moins un champs',
                duration: 1500
            });
        } else {

            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
            });
            $rootScope.latLng = undefined



            /*************||||||||||||||||||||||||||||||||||||||************/
            ConnectionFactory.isConnected(function() {


                DoctorLocatorFactory.ifTableExist(db).then(function(exist) {

                    if (exist) {

                        DoctorLocatorFactory.findDoctorDB(db, doc, function(rs) {
                            console.warn(rs)

                            DoctorLocatorFactory.emptyDoctorTable(db).then(function() {

                                DoctorLocatorFactory.createDoctorTable(db).then(function(result) {
                                    console.log(rs.rows)
                                    var arr = [];
                                    for (var i = 0; i < rs.rows.length; i++) {
                                        arr[i] = rs.rows.item(i)
                                    };
                                      if(arr.length>0){
                                         DoctorLocatorFactory.insertBulkIntoDoctorTable(db, arr).then(function() {

                                            $ionicLoading.hide();
                                            console.log($rootScope.isAuthenticated)
                                            if ($rootScope.isAuthenticated == false) { // c'st un visiteur
                                                $state.go('visiteurMenu.resultDoctor')
                                            } else {
                                                $state.go('menu.resultDoctor')
                                            }


                                    }, function() {

                                    })

                                    }else{
                                        
                                            $ionicLoading.hide();
                                            console.log($rootScope.isAuthenticated)
                                            if ($rootScope.isAuthenticated == false) { // c'st un visiteur
                                                $state.go('visiteurMenu.resultDoctor')
                                            } else {
                                                $state.go('menu.resultDoctor')
                                            }
                                    }




                                }, function(error) {
                                    $ionicLoading.hide();
                                    console.log("erreur createDoctorTable :" + error)
                                })




                            }, function(erreur) {
                                $ionicLoading.hide();
                                console.log("erreur emptyDoctorTable :" + erreur)
                            });



                        });

                    } else {

                        /********************************************************************/

                        /**
                         * get All doctors from server
                         */

                        DoctorLocatorFactory.getDoctorList().success(function(data, status, headers, config) {
                            console.log(data)

                            var array = []
                            for (var i = 0; i < data.length; i++) {
                                array.push({
                                    id: data[i].Id,
                                    name: data[i].Nom,
                                    lastname: data[i].Prenom,
                                    specialite: data[i].IdSpecialite,
                                    sexe: data[i].Sexe,
                                    adresse: data[i].Adresse, // Id de cabinet
                                    tel: data[i].Tel,
                                    BD: data[i].DateNaissance
                                })
                            }

                            DoctorLocatorFactory.createAllDoctorsTable(db).then(function() {

                                DoctorLocatorFactory.insertBulkIntoAllDoctorsTable(db, array).then(function(result) {


                                    DoctorLocatorFactory.findDoctorDB(db, doc, function(rs) {
                                        console.warn(rs)

                                        DoctorLocatorFactory.emptyDoctorTable(db).then(function() {
                                            
                                                DoctorLocatorFactory.createDoctorTable(db).then(function(result) {
                                                    console.log(rs.rows)
                                                    var arr = [];
                                                    for (var i = 0; i < rs.rows.length; i++) {
                                                        arr[i] = rs.rows.item(i)
                                                    };
                                                    if(arr.length>0){
                                                         DoctorLocatorFactory.insertBulkIntoDoctorTable(db, arr).then(function() {

                                                            $ionicLoading.hide();
                                                            console.log($rootScope.isAuthenticated)
                                                            if ($rootScope.isAuthenticated == false) { // c'st un visiteur
                                                                $state.go('visiteurMenu.resultDoctor')
                                                            } else {
                                                                $state.go('menu.resultDoctor')
                                                            }


                                                    }, function() {

                                                    })

                                                    }else{
                                                        
                                                            $ionicLoading.hide();
                                                            console.log($rootScope.isAuthenticated)
                                                            if ($rootScope.isAuthenticated == false) { // c'st un visiteur
                                                                $state.go('visiteurMenu.resultDoctor')
                                                            } else {
                                                                $state.go('menu.resultDoctor')
                                                            }
                                                    }





                                                }, function(error) {
                                                    $ionicLoading.hide();
                                                    console.log("erreur createDoctorTable :" + error)
                                                })

                                            


                                        }, function(erreur) {
                                            $ionicLoading.hide();
                                            console.log("erreur emptyDoctorTable :" + erreur)
                                        });



                                    });


                                    //         DoctorLocatorFactory.emptyDoctorTable(db).then(function() {



                                    //                 DoctorLocatorFactory.createDoctorTable(db).then(function(result) {
                                    //                     DoctorLocatorFactory.getDoctorListByName(doc2.name, doc2.lastname, doc2.specialty, doc2.gendre, function() {
                                    //                         $ionicLoading.hide();
                                    //                         console.log($rootScope.isAuthenticated)
                                    //                         if ($rootScope.isAuthenticated == false) { // c'st un visiteur
                                    //                             $state.go('visiteurMenu.resultDoctor')
                                    //                         } else {
                                    //                             $state.go('menu.resultDoctor')
                                    //                         }
                                    //                     });


                                    //                 }, function(error) {
                                    //                     $ionicLoading.hide();
                                    //                     console.log("erreur createDoctorTable :" + error)
                                    //                 })


                                    //         }, function(erreur) {
                                    //             $ionicLoading.hide();
                                    //             console.log("erreur emptyDoctorTable :" + erreur)
                                    //         });
                                });
                            });




                        }).error(function(data, status, headers, config) {
                            ionicToast.show('Une erreur serveur est servenue', 'top', false, 2500);
                            setTimeout(function() {
                                ionic.Platform.exitApp()
                            }, 2600);
                        })


                    };

                }, function() {

                });




            }, function() {
                $ionicLoading.hide();
                PopupFactory.myPopup('Utiliser les reseaux cellulaires et wifi pour determiner la recherche');
                console.log("not connected");
            });




            /**************************************/



        }
        //else    
    }



});