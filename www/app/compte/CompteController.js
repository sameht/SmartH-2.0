appContext.controller('CompteController', function($scope ,CompteFactory,$ionicPlatform, $stateParams){

		//$scope.tabMarginLeft = 10;

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

        CompteFactory.getLocaluser(db).then(function(result){
             if (result.rows.length == 1) {
                $scope.user = {
                    id: result.rows.item(0).id,
                    name: result.rows.item(0).name,
                    lastname: result.rows.item(0).lastname,
                    city: result.rows.item(0).city,
                    sexe: result.rows.item(0).sexe,
                    BD: new Date(result.rows.item(0).BD),
                    address: result.rows.item(0).address,
                    couv: result.rows.item(0).couv
                }
            }
        },function(reason){
            console.log("error : "+reason)
        });

    });
})
