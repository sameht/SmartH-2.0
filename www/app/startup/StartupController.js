appContext.controller('StartupController',function($state,$rootScope,$ionicLoading, $ionicPlatform, $ionicHistory,LoginFactory,RdvFactory){

	console.warn("StartupController")
	//test if the user is authenticated
	var isAuthenticated = localStorage.getItem("isAuthenticated");
   	var x2js = new X2JS();
    //console.log(isAuthenticated);
    
    $ionicLoading.show({
             content: 'Loading',
             animation: 'fade-in',
          });

	/*if( isAuthenticated == "true"){
		console.info("goTo Home")
		$state.go("menu.home");
	}
		
	else {
		console.info("goTo login")
		$state.go("login");
	} */

	//////////////////////////////////////////////
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


	LoginFactory.selectCredentials(db).then(function(result){

		if(typeof(result)=='number'){
			$rootScope.isAuthenticated=false
			$state.go('visiteurMenu.visiteurHome')
		}else{
			
			if(result.rows.length>0){
				$rootScope.isAuthenticated=true
				$state.go('synchronisation')
			}else{
				$rootScope.isAuthenticated=false
				$state.go('visiteurMenu.visiteurHome')
			}
		}
			
			
		
	},function(reason){

	});

	


    });

	$ionicLoading.hide();
	//$ionicHistory.clearHistory();
	$ionicHistory.nextViewOptions({ disableBack: true, disableAnimate: true, historyRoot: true });
})