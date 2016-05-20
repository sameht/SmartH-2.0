appContext.controller('RdvController', function($scope,$ionicLoading,$mdDialog, RdvFactory, $stateParams, $ionicPlatform) {


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

        /**
         * display rdv list
         */
        RdvFactory.getRdvById(db, $stateParams.id).then(function(result) {
            if (result.rows.length == 1) {
                $scope.rdv = {
                    id: result.rows.item(0).id,
                    idDoc: result.rows.item(0).idDoc,
                    doctor: result.rows.item(0).doctor,
                    date: new Date( result.rows.item(0).date),
                    // heure: result.rows.item(0).heure,
                    adresse: result.rows.item(0).adresse
                }
            }
        }, function(reason) {
        });


       /**
        * update button
        */


    });

    $scope.editRdv =function(){
       angular.element('#rdvEdit').triggerHandler('click');
    }

    $scope.annulerRdv =function(){
        
         RdvFactory.deleteRdvServer($scope.rdv.id, function(data){
            $ionicLoading.show({ template: 'Demande envoyée', duration:3000  });
        },function(error){
            $ionicLoading.show({ template: 'pas de réponse du serveur', duration:3000  });
        })
    }
    $scope.isOpen = false;
    $scope.selectedMode = 'md-fling';
    /*
    $scope.topDirections = ['left', 'up'];
    $scope.bottomDirections = ['down', 'right'];
    $scope.availableModes = ['md-fling', 'md-scale'];
    $scope.availableDirections = ['up', 'down', 'left', 'right'];
    $scope.selectedDirection = 'up';
    */

   
})
