appContext.controller('MenuController', function($scope, $state, $ionicHistory, LoginFactory,CompteFactory,ConsultationFactory,MyDoctorsFactory,RdvFactory, $ionicPlatform){
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
		LoginFactory.emptyIdentifiantTable(db).then(function(result){
            
              CompteFactory.emptyUserTable(db).then(function(result){

                ConsultationFactory.emptyConsultationTable(db).then(function(result){

                    MyDoctorsFactory.emptyMyDoctorsTable(db).then(function(result){

                        RdvFactory.emptyRdvTable(db).then(function(result){

                            localStorage.setItem("isAuthenticated", false);
                            $ionicHistory.clearHistory();
                            $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
                            $state.go("startup");
                            console.log("deconnection")

                        },function(reason){});

                    },function(reason){});

                },function(reason){});

              },function(reason){});



        },function(reason){

        });
		//LoginFactory.logout();
		//localStorage.clear(isAuthentified);
	
		
	} 
});