appContext.controller('RdvController', function($scope,$mdDialog, RdvFactory, $stateParams, $ionicPlatform) {

      
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
                    date: result.rows.item(0).date,
                    heure: result.rows.item(0).heure,
                    adresse: result.rows.item(0).adresse
                }
            }
        }, function(reason) { 
        });


       /**
        * update button 
        */

        $scope.update =function(){

        


        }
    /************************************************/
    /*  var self = this;
      $scope.openDialog = function($event) {
        $mdDialog.show({
        controller: updateController,
        controllerAs: 'ctrl',
        templateUrl: '.html',
        parent: angular.element(document.body),
        targetEvent: $event,
        clickOutsideToClose:true
      })
    }*/
    /*------------------------------*/
    });
})