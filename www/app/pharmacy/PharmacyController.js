appContext.controller('PharmacyController', function($scope, $state,$stateParams,$ionicPlatform,DoctorLocatorFactory){
	
    // for opening db:
    var db = null;
    $ionicPlatform.ready(function() {
        /**
         * create/open DB
         */
        if (window.cordova) {
            db = window.sqlitePlugin.openDatabase({
                name: "smartH",
                androidDatabaseImplementation: 2, location: 1
            }); // device
        } else {
            db = window.openDatabase("smartH", '1', 'desc', 1024 * 1024 * 5); // browser

        }


        DoctorLocatorFactory.getDoctorById(db, $stateParams.id).then(function(result) {
            if (result.rows.length == 1) {
                $scope.doctor = {
                    id: result.rows.item(0).id,
                    doctor: result.rows.item(0).doctor,
                    specialite: result.rows.item(0).specialite,
                    sexe: result.rows.item(0).sexe,
                    adresse: result.rows.item(0).adresse,
                    tel: result.rows.item(0).tel
                }
            }
        }, function(reason) { 
        });


    });
})