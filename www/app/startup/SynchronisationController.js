appContext.controller('SynchronisationController', function($state, LoginFactory, RdvFactory, ConnectionFactory, MyDoctorsFactory, $rootScope, CompteFactory, ConsultationFactory, $scope, $ionicLoading, $ionicPlatform, $q) {


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



        /*-------------------------------------*/


        LoginFactory.selectCredentials(db).then(function(result) {
            $rootScope.idUser = parseInt(result.rows.item(0).userId)
            //console.log(result.rows.item(0))
        }, function(error) {
            console.log("error selectCredentials: " + error)
        })

        var t = new Date().getTime();

        ConnectionFactory.isConnected(function() { // s'il y a de connection maj les données

            /**
             * rdv
             */

            RdvFactory.createRdvTable(db).then(function() {

                RdvFactory.getRdvList($rootScope.idUser).success(function(data, status, headers, config) {
                    //RdvFactory.getRdvList().then(function(data ){
                    var array=[]
                    for(var i=0;i<data.length;i++){

                         array.push({id : data[i].Id,
                            idDoc:data[i].IdMedecin,
                            doctor: data[i].Nom +" "+ data[i].Prenom,
                            date : data[i].Date.date,
                            adresse :data[i].CabinetAdresse,
                            etat:data[i].Etat})
                    }

                    //console.log(array)

                    RdvFactory.rdvAppelRecur(db, 0, array, function(valid) {

                        if (!valid) {
                            console.error("valid " + valid)
                            deferredRdv.reject()
                                // $q.all

                        } else {
                            deferredRdv.resolve();
                        }

                    });

                }).error(function(data, status, headers, config) {
                   // },function(data) {
                    console.log("eroor")
                    $ionicLoading.show({
                        template: 'Pas de réponse du serveur',
                        duration: 3000
                    });
                });

            }, function(reason) {

            });


            /**
             * consultation
             */

            ConsultationFactory.createConsultationTable(db).then(function(result) {

                ConsultationFactory.getConsultationList($rootScope.idUser).success(function(data, status, headers, config) {
                  //  ConsultationFactory.getConsultationList($rootScope.idUser).then(function(data ){
                    var array = []
                    for(var i=0;i<data.length;i++){
                        array.push({
                        id: data[i].Id,
                        idDoc: data[i].IdMedecin,
                        doctor: "IdMedecin",
                        specialite: "",
                        date: data[i].Date.date,
                        maladie: data[i].Type,
                        medicament: data[i].Evaluation,
                        prix: data[i].Montant,
                        description: data[i].TraitementSortie
                    })
                    }

                    ConsultationFactory.consultationAppelRecur(db, 0, array, function(valid) {
                        if (!valid) {
                            console.error("consultation data error");
                            deferredCons.reject()
                        } else {

                            deferredCons.resolve();
                        }

                    })


                }).error(function(data, status, headers, config) {
                  //  },function(data){

                    $ionicLoading.show({
                        template: 'Pas de réponse du serveur',
                        duration: 3000
                    });
                });


            }, function(reason) {
                console.error("createConsultationTable error");
            })


            /**
             * my doctors
             */

            MyDoctorsFactory.createMyDoctorsTable(db).then(function(result) {
               MyDoctorsFactory.getDoctorList($rootScope.idUser).success(function(data, status, headers, config ){

               // MyDoctorsFactory.getDoctorList($rootScope.idUser).then(function(data) {
                    var array=[]
                    for(var i=0;i< data.length ;i++){
                        array.push({ id : data[i].Id,
                            name : data[i].Nom,
                            lastname : data[i].Prenom,
                            specialite : data[i].Specialite,
                            sexe : data[i].Sexe,
                            adresse:data[i].Adresse,
                            tel : data[i].Tel,

                        })
                    }
                   console.log("-------------------")
                    console.log(array)
                    MyDoctorsFactory.DoctorListAppelRecur(db, 0, array, function(valid) {
                        if (!valid) {
                            console.error("DoctorListAppelRecur error");
                            deferredDoctor.reject()
                        } else {
                            deferredDoctor.resolve();
                        }

                    })

                 }).error(function(data, status, headers, config ){
               // }, function() {
                    console.error("getConsultationList error");

                });


            }, function(reason) {
                console.error("createConsultationTable error");
            })


            /**
             *User
             */

            CompteFactory.createUserTable(db).then(function(result) {

                CompteFactory.getUser($rootScope.idUser).success(function(data, status, headers, config) {
                    console.log(data)

                    var array = []

                    array.push({
                        id: data[0].Id,
                        name: data[0].Nom,
                        lastname: data[0].Prenom,
                        city: "Tunis, TN",
                        sexe: data[0].Sexe,
                        BD: data[0].DateNaissance.date,
                        address: data[0].Adresse,
                        couv: data[0].CouvertureSociale,
                        cin: data[0].Cin,
                        tel: data[0].Tel,
                        profession: data[0].ProfessionPatient,
                        etatCivile: data[0].EtatCivile
                    })
                    console.log(array[0])
                    CompteFactory.createOrUpdateUser(db, array[0]).then(function(result) {
                        deferredUser.resolve();

                    }, function(reason) {
                        console.log("error user" + reason)
                        deferredUser.reject();


                    })
                }).error(function(data, status, headers, config) {


                    $ionicLoading.show({
                        template: 'pas de réponse du serveur',
                        duration: 3000
                    });
                });

            }, function(reason) {

            })


            /*--------------------------------------------------------------------------------*/

            $q.all([
                    promiseRdv,
                    promiseDoctor,
                    promiseUser,
                    promiseCons
                ])
                .then(function(values) {

                    $ionicLoading.hide()
                    $state.go('menu.home')


                    return values;

                });

        }, function() {
            $ionicLoading.hide()
            $state.go('menu.home')
            console.log("not connected");
        });

    });



});
//  AIzaSyAzDrzzWjmPtgKE-cILxVNQp_S9ZScUu2s
