appContext.controller('MenuController', function($scope, $state, $ionicHistory, LoginFactory, $ionicPlatform){
    // for opening db:
    var db = null;
    $ionicPlatform.ready(function() {
        /**
         * create/open DB
         */
        if (window.cordova) {
            db = window.sqlitePlugin.openDatabase({name : "smartH" , androidDatabaseImplementation: 2, location: 1}); // device
        } else {
            db = window.openDatabase("smartH", '1', 'desc', 1024 * 1024 * 5); // browser

        }
    });


	//$ionicHistory.clearHistory();
    $ionicHistory.nextViewOptions({ disableBack: true, disableAnimate: true, historyRoot: true });

	console.warn('Menu controller')
	$scope.logout=function(){
		LoginFactory.emptyIdentifiantTable(db).then(function(result){},function(reason){});
		LoginFactory.logout();
		//localStorage.clear(isAuthentified);
		localStorage.setItem("isAuthenticated", false);
		$ionicHistory.clearHistory();
        $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
        $state.go("startup");
		console.log("deconnection")
		
	} 
});