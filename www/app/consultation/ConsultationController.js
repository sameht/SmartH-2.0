appContext.controller('ConsultationController', function($scope, $ionicPlatform,$stateParams,ConsultationFactory){
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


        ConsultationFactory.getConsultationById(db, $stateParams.id).then(function(result) {
            if (result.rows.length == 1) {
                $scope.consultation = {
                    id: result.rows.item(0).id,
                    doctor: result.rows.item(0).doctor,
                    specialite: result.rows.item(0).specialite,
                    date: result.rows.item(0).date,
                    maladie: result.rows.item(0).maladie,
                    medicament: result.rows.item(0).medicament,
                    prix: result.rows.item(0).prix,
                    description: result.rows.item(0).description
                }
            }
        }, function(reason) { 
        });


    });

})