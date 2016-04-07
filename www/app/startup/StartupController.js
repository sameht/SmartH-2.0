appContext.controller('StartupController',function($state,$ionicLoading, $ionicPlatform, $ionicHistory){

	console.warn("StartupController")
	//test if the user is authenticated
	var isAuthenticated = localStorage.getItem("isAuthenticated");
   
    //console.log(isAuthenticated);
    
    $ionicLoading.show({
             content: 'Loading',
             animation: 'fade-in',
          });

	if( isAuthenticated == "true"){
		console.info("goTo Home")
		$state.go("menu.home");
	}
		
	else {
		console.info("goTo login")
		$state.go("login");
	}
		
	$ionicLoading.hide();

	$ionicHistory.clearHistory();
})