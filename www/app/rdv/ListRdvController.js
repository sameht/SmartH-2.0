appContext.controller('ListRdvController', function($scope, $rootScope,MyDoctorsFactory, RdvFactory, $ionicLoading,$ionicPlatform, ConnectionFactory, PopupFactory) {

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
                console.log(result)
                var array = [];
                for (var i = 0; i < result.rows.length; i++) {
                    array[i] = result.rows.item(i);
                    array[i].date=new Date(array[i].date)
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
            ConnectionFactory.isConnected(function() { // s'il y a de connection maj les données
                /**
                 * rdv
                 */

                RdvFactory.createRdvTable(db).then(function() {

                        RdvFactory.getRdvList($rootScope.idUser).success(function(data, status, headers, config) {
                            // RdvFactory.getRdvList().then(function(data ){

                            RdvFactory.rdvAppelRecur(db, 0, data, function(valid) {


                                if (!valid) {
                                    console.error("valid " + valid)

                                    // $q.all

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
                            });
                        }).error(function(data, status, headers, config) {
                            // },function(data) {
                            console.log("eroor")
                            $ionicLoading.show({
                                template: 'pas de réponse du serveur',
                                duration: 3000
                            });
                        });

                    }, function(reason) {

                    })
                    /**********************************************************************************/
                    /*--------------------------------------------------------------------------------*/

                .finally(function() {
                    // Stop the ion-refresher from spinning
                    $scope.$broadcast('scroll.refreshComplete');
                });


            }, function() {
                PopupFactory.myPopup('Utiliser les reseaux cellulaires et wifi pour rafraichir la liste');
                console.log("not connected");
                // Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');
            });
        }

    })


})