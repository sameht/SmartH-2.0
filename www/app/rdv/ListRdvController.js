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

        RdvFactory.getRdvLocalList(db).then(function(result) {
            var array = [];
            for (var i = 0; i < result.rows.length; i++) {
                array[i] = result.rows.item(i);
            }; // return array of objects 
            $scope.rdvArray = array;
        }, function(reason) {

        });

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
            idDoctorArray = []
            $scope.rdvArray = [];
            RdvFactory.createRdvTable(db).then(function() {
                //  console.log("createRdvTable")
                var rdvList=RdvFactory.getRdvList();
                for (var i = 0; i < rdvList.length; i++) {

                    if (pushIfNotExist(idDoctorArray, rdvList[i].idDoc)) {
                        idDoctorArray.push(rdvList[i].idDoc)
                    }

                    RdvFactory.createOrUpdateRdv(db, rdvList[i]).then(function(result) {
                        // console.log("rdv ajouté "+i)
                        RdvFactory.getRdvLocalList(db).then(function(result) {
                            var array = [];
                            for (var i = 0; i < result.rows.length; i++) {
                                array[i] = result.rows.item(i);
                            }; // return array of objects 
                            $scope.rdvArray = array;
                        }, function(reason) {

                        });
                    }, function(reason) {

                    }).finally(function() {
                        // Stop the ion-refresher from spinning
                        $scope.$broadcast('scroll.refreshComplete');
                    });


                };

                /*---------------------------------*/
                MyDoctorsFactory.createMyDoctorsTable(db).then(function(result) {
                        console.log("refresh doctors")
                        for (var i = 0; i < idDoctorArray.length; i++) {
                            var doctorArray = MyDoctorsFactory.getDoctorById(idDoctorArray[i]);
                            console.log("doctorArray " + doctorArray[0].id)

                            MyDoctorsFactory.createOrUpdateDoctor(db, doctorArray[0]).then(function() {
                                console.log("updated")
                            }, function(error) {
                                console.log('error : ' + error)
                            })
                        };

                    }, function(reason) {

                    })
                /*--------------------------------*/
            }, function(reason) {

            });

        }

    })


})


/*      rdv=RdvFactory.getRdvList();
      for (var i = 0; i<rdv.length; i++) {
          RdvFactory.setRdv(db,rdv[i],function(){
              console.log("rdv ajouté")
          })
      };*/