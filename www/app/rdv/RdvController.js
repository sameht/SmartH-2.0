appContext.controller('RdvController', function($scope, RdvFactory, $stateParams, $ionicPlatform) {

    this.topDirections = ['left', 'up'];
      this.bottomDirections = ['down', 'right'];
      this.isOpen = false;
      this.availableModes = ['md-fling', 'md-scale'];
      this.selectedMode = 'md-fling';
      this.availableDirections = ['up', 'down', 'left', 'right'];
      this.selectedDirection = 'up';




      
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


        RdvFactory.getRdvById(db, $stateParams.id).then(function(result) {
            if (result.rows.length == 1) {
                $scope.rdv = {
                    id: result.rows.item(0).id,
                    idDoc: result.rows.item(0).idDoc,
                    doctor: result.rows.item(0).doctor,
                    date: result.rows.item(0).date,
                    heure: result.rows.item(0).heure,
                    adresse: result.rows.item(0).adresse
                }
            }
        }, function(reason) { 
        });


    });
})