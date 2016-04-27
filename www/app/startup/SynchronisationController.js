appContext.controller('SynchronisationController', function($state, RdvFactory, MyDoctorsFactory, CompteFactory, ConsultationFactory,$scope, $ionicLoading, $ionicPlatform){

	
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


        idDoctorArray=[]
        /*-------------------------------------*/
        var pushIfNotExist=function(array , elt){
        	for (var i = 0; i < array.length; i++) {
        		if (array[i]==elt) {
        			return false
        		};
        	};

        	return true;
        }
        /*-------------------------------------*/

       /**
	    * rdv
	    */

		RdvFactory.createRdvTable(db).then(function(){
	      //  console.log("createRdvTable")
	      	var rdvList=RdvFactory.getRdvList() ;
	        for (var i = 0; i < rdvList.length; i++) {

	        	if(pushIfNotExist(idDoctorArray,rdvList[i].idDoc)){
	        		idDoctorArray.push(rdvList[i].idDoc)
	        	}

	            RdvFactory.createOrUpdateRdv(db,rdvList[i]).then(function(result){
	                // console.log("rdv ajouté "+i)
	            },function(reason){

	            });
	            
	        };
	    },function(reason){ 

	    });
		
	   /**
	    * consultation
	    */  

	    ConsultationFactory.createConsultationTable(db).then(function(result){
			//console.log("create table")
			var consultationArray=ConsultationFactory.getConsultationList();
			for(var i=0 ; i<consultationArray.length ; i++){

				if(pushIfNotExist(idDoctorArray,consultationArray[i].idDoc)){
	        		idDoctorArray.push(consultationArray[i].idDoc)
	        	}

				ConsultationFactory.createOrUpdateRdv(db,consultationArray[i]).then(function(result){
					//console.log("ajout ou maj")
				},function(reason){

				})

			}
		}, function(reason){

		})


	    /**
	     * my doctors
	     */

	    MyDoctorsFactory.createMyDoctorsTable(db).then(function(result){
			
			for (var i = 0; i < idDoctorArray.length; i++) {
				var doctorArray=MyDoctorsFactory.getDoctorById(idDoctorArray[i]);
				//console.log("doctorArray "+doctorArray[0].id)
				MyDoctorsFactory.createOrUpdateDoctor(db,doctorArray[0]).then(function(){

				},function(error){
					console.log('error : '+error)
				})
			};
		
		}, function(reason){

		})


	   /**
	    *User
	    */

	    CompteFactory.createUserTable(db).then(function(result){
			// console.log("create user table")
			//console.log("getuser : "+CompteFactory.getUser()[0])
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