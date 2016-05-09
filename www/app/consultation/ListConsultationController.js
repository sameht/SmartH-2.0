appContext.controller('ListConsultationController', function($scope, $q, $ionicPlatform, MyDoctorsFactory, ConsultationFactory) {
    $scope.consultationArray = [];

    var db = null;
    $ionicPlatform.ready(function() {

        /**
         * create/open DB
         */
        if (window.cordova) {
            db = window.sqlitePlugin.openDatabase({
                name: "smartH",
                androidDatabaseImplementation: 2,
                location: 1
            }); // device
        } else {
            db = window.openDatabase("smartH", '1', 'desc', 1024 * 1024 * 5); // browser

        }

        var displayCons = function() {
            // display local consultation list
            ConsultationFactory.getConsultationLocalList(db).then(function(result) {
                var array = [];
                for (var i = 0; i < result.rows.length; i++) {
                    array[i] = result.rows.item(i);
                }; // return array of objects 
                $scope.consultationArray = array;
                //   console.log("consultation affiché ")
            }, function(reason) {
                console.log("error " + reason)
            });

        }


        displayCons();


        /*-------------------------------------*/
        var pushIfNotExist = function(array, elt) {
                for (var i = 0; i < array.length; i++) {
                    if (array[i] == elt) {
                        return false
                    };
                };

                return true;
            }
            /*-------------------------------------*/

        
        $scope.doRefresh = function() {

            /**
             * consultation
             */

            ConsultationFactory.createConsultationTable(db).then(function(result) {

                ConsultationFactory.getConsultationList().success(function(data, status, headers, config ){


                    ConsultationFactory.consultationAppelRecur(db, 0, data, function(valid) {
                        if (!valid) {
                            console.error("consultationArray error");

                        } else {

                            /**
                             * my doctors
                             */
                            MyDoctorsFactory.createMyDoctorsTable(db).then(function(result) {

                                    MyDoctorsFactory.getDoctorList().then(function(DocArray) {


                                        MyDoctorsFactory.DoctorListAppelRecur(db, 0, DocArray, function(valid) {
                                            if (!valid) {
                                                console.error("DoctorListAppelRecur error");
                                            } else {
                                                displayCons();
                                            }

                                        })


                                    }, function() {
                                        console.error("getConsultationList error");

                                    });


                                }, function(reason) {
                                    console.error("createConsultationTable error");
                                })
                                /*************************************************/

                        }

                    })

                 }).error(function(data, status, headers, config ){

                 $ionicLoading.show({ template: 'pas de réponse du serveur', duration:3000  });
             });


            }, function(reason) {
                console.error("createConsultationTable error");
            })

            /**********************************************************************************/
            /*--------------------------------------------------------------------------------*/

            .finally(function() {
                // Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');
            });

        }



    })


})