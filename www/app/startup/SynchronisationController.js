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
       



        /**
         * rdv
         */

        RdvFactory.createRdvTable(db).then(function() {

           // RdvFactory.getRdvList().success(function(data, status, headers, config ){
            RdvFactory.getRdvList().then(function(data ){

                RdvFactory.rdvAppelRecur(db, 0, data, function(valid) {


                    if (!valid) {
                        console.error("valid " + valid)
                        deferredRdv.reject()
                            // $q.all

                    } else {
                        console.info("rdvAppelRecur okkkkkkkkk");
                        deferredRdv.resolve();
                    }

                });

           // }).error (function(data, status, headers, config ) {
            },function(data) {
                console.log("eroor")
                $ionicLoading.show({ template: 'pas de réponse du serveur', duration:3000  });
            });

        }, function(reason) {

        });


        /**
         * consultation
         */

        ConsultationFactory.createConsultationTable(db).then(function(result) {

            //ConsultationFactory.getConsultationList().success(function(data, status, headers, config ){
            ConsultationFactory.getConsultationList().then(function(data ){

                ConsultationFactory.consultationAppelRecur(db, 0, data, function(valid) {
                    if (!valid) {
                        console.error("consultation data error");
                        deferredCons.reject()
                    } else {

                        console.info("consultationAppelRecur okkkkkkkkk");
                        deferredCons.resolve();
                    }

                })


                //}).error(function(data, status, headers, config ){
                },function(data){

                 $ionicLoading.show({ template: 'pas de réponse du serveur', duration:3000  });
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

           // CompteFactory.getUser().success(function(data, status, headers, config ){
            data=CompteFactory.getUser()
            CompteFactory.createOrUpdateUser(db, data[0]).then(function(result) {
                console.info("createOrUpdateUser okkkkkkkkk");
                deferredUser.resolve();

            }, function(reason) {
                console.log("error user" + reason)
                deferredUser.reject();


            })
        /*}).error(function(data, status, headers, config ){
        

                 $ionicLoading.show({ template: 'pas de réponse du serveur', duration:3000  });
             });*/

        }, function(reason) {

        })


        /*--------------------------------------------------------------------------------*/

        $q.all([
                promiseRdv,
               // promiseCons,
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