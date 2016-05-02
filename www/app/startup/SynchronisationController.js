appContext.controller('SynchronisationController', function($state, RdvFactory, MyDoctorsFactory, $rootScope, CompteFactory, ConsultationFactory, $scope, $ionicLoading, $ionicPlatform, $q) {


    // for opening db:
    var db = null;

    $ionicPlatform.ready(function() {

        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
        });

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

        deferredRdv = $q.defer();
        deferredCons = $q.defer();
        deferredDoctor = $q.defer();
        deferredUser = $q.defer();

        promiseRdv = deferredRdv.promise;
        promiseCons = deferredCons.promise;
        promiseDoctor = deferredDoctor.promise;
        promiseUser = deferredUser.promise;

        idDoctorArray = []

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
        $rootScope.t1 = 0;
        $rootScope.t2 = 0;
        $rootScope.t3 = 0;
        $rootScope.t4 = 0;



        /**
         * rdv
         */

        RdvFactory.createRdvTable(db).then(function() {

            RdvFactory.getRdvList().then(function(rdvList) {

                RdvFactory.rdvAppelRecur(db, 0, rdvList, function(valid) {


                    if (!valid) {
                        console.error("valid " + valid)
                        deferredRdv.reject()
                            // $q.all

                    } else {
                        console.info("rdvAppelRecur okkkkkkkkk");
                        deferredRdv.resolve();
                    }

                });

            }, function() {
                console.log("eroor")
            });

        }, function(reason) {

        });


        /**
         * consultation
         */

        ConsultationFactory.createConsultationTable(db).then(function(result) {

            ConsultationFactory.getConsultationList().then(function(consultationArray) {

                ConsultationFactory.consultationAppelRecur(db, 0, consultationArray, function(valid) {
                    if (!valid) {
                        console.error("consultationArray error");
                        deferredCons.reject()
                    } else {

                        console.info("consultationAppelRecur okkkkkkkkk");
                        deferredCons.resolve();
                    }

                })


            }, function() {
                console.error("getConsultationList error");

            });


        }, function(reason) {
            console.error("createConsultationTable error");
        })

        /**
         * my doctors
         */

        MyDoctorsFactory.createMyDoctorsTable(db).then(function(result) {

            MyDoctorsFactory.getDoctorList().then(function(DocArray) {


                MyDoctorsFactory.DoctorListAppelRecur(db, 0, DocArray, function(valid) {
                    if (!valid) {
                        console.error("DoctorListAppelRecur error");
                        deferredDoctor.reject()
                    } else {
                        console.info("DoctorListAppelRecur okkkkkkkkk");
                        deferredDoctor.resolve();
                    }

                })


            }, function() {
                console.error("getConsultationList error");

            });


        }, function(reason) {
            console.error("createConsultationTable error");
        })


        /**
         *User
         */

        CompteFactory.createUserTable(db).then(function(result) {

            var array = CompteFactory.getUser();
            CompteFactory.createOrUpdateUser(db, array[0]).then(function(result) {
                console.info("createOrUpdateUser okkkkkkkkk");
                deferredUser.resolve();

            }, function(reason) {
                console.log("error user" + reason)
                deferredUser.reject();


            })


        }, function(reason) {

        })


        /*--------------------------------------------------------------------------------*/

        $q.all([
                promiseRdv,
                promiseCons,
                promiseDoctor,
                promiseUser
            ])
            .then(function(values) {

                $ionicLoading.hide()
                $state.go('menu.home')


                return values;

            });



    });



});
//  AIzaSyAzDrzzWjmPtgKE-cILxVNQp_S9ZScUu2s