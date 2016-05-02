appContext.controller('ListRdvController', function($scope, MyDoctorsFactory, RdvFactory, $ionicPlatform, ConnectionFactory) {

    $scope.rdvArray = [];
    // for opening db:
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


        // display local rdv list
        var displayRdv = function() {
            RdvFactory.getRdvLocalList(db).then(function(result) {
                var array = [];
                for (var i = 0; i < result.rows.length; i++) {
                    array[i] = result.rows.item(i);
                }; // return array of objects 
                $scope.rdvArray = array;
            }, function(reason) {

            });
        }

        displayRdv();

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

        idDoctorArray = []
        $scope.doRefresh = function() {
            /**
             * rdv
             */

            RdvFactory.createRdvTable(db).then(function() {

                    RdvFactory.getRdvList().then(function(rdvList) {

                        for (var i = 0; i < rdvList.length; i++) {

                            if (pushIfNotExist(idDoctorArray, rdvList[i].idDoc)) {
                                idDoctorArray.push(rdvList[i].idDoc)
                            }

                        };

                        RdvFactory.rdvAppelRecur(db, 0, rdvList, function(valid) {

                            if (!valid) {
                                console.error("valid " + valid)

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
                                                    displayRdv();
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

                        });

                    }, function() {
                        console.log("eroor")
                    });

                }, function(reason) {

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