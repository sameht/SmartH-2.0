appContext.controller('SynchronisationController', function($state, RdvFactory, CompteFactory, ConsultationFactory,$scope, $ionicLoading, $ionicPlatform){

	$scope.rdvArray=[];
    // for opening db:
    var db = null;

    $ionicPlatform.ready(function() {

         $ionicLoading.show({
             content: 'Loading',
             animation: 'fade-in',
          }); 

        /**
         * create/open DB
         */
        if (window.cordova) {
            db = window.sqlitePlugin.openDatabase({name : "smartH" , androidDatabaseImplementation: 2, location: 1}); // device
        } else {
            db = window.openDatabase("smartH", '1', 'desc', 1024 * 1024 * 5); // browser

        }



		RdvFactory.createRdvTable(db).then(function(){
	      //  console.log("createRdvTable")
	        for (var i = 0; i < RdvFactory.getRdvList().length; i++) {

	            RdvFactory.createOrUpdateRdv(db,RdvFactory.getRdvList()[i]).then(function(result){
	                // console.log("rdv ajouté "+i)
	            },function(reason){

	            });

	        }; 
	    },function(reason){ 

	    });

	    ConsultationFactory.createConsultationTable(db).then(function(result){
			//console.log("create table")
			var array=ConsultationFactory.getConsultationList();
			for(var i=0 ; i<array.length ; i++){
				ConsultationFactory.createOrUpdateRdv(db,array[i]).then(function(result){
					//console.log("ajout ou maj")
				},function(reason){

				})

			}
		}, function(reason){

		})


	   /**
	    *User
	    */
	    CompteFactory.createUserTable(db).then(function(result){
			// console.log("create user table")
			console.log("getuser : "+CompteFactory.getUser()[0])
			var array=CompteFactory.getUser();
				CompteFactory.createOrUpdateUser(db,array[0]).then(function(result){
					//console.log("user ajoutéé"+array[0])
				},function(reason){
					console.log("error user"+reason)

				})

			
		}, function(reason){

		})



//*******************
			
	    /*
	    $q.all().then().....    */

	    $ionicLoading.hide();

		$state.go('menu.home') ;

	})
})