appContext.controller('ListConsultationController', function($scope, $ionicPlatform, ConsultationFactory){
	$scope.consultationArray=[];

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

   

        // display local consultation list
        ConsultationFactory.getConsultationLocalList(db).then(function(result){
             var array =[];
            for (var i = 0; i<result.rows.length; i++) {
                array[i]=result.rows.item(i);
             };// return array of objects 
            $scope.consultationArray=array;
         //   console.log("consultation affiché ")
        },function(reason){
 			console.log("error "+reason)
        }) ;


        $scope.doRefresh = function(){
            // $scope.consultationArray=[];
             ConsultationFactory.createConsultationTable(db).then(function(){

            var array=ConsultationFactory.getConsultationList();
            for(var i=0 ; i<array.length ; i++){

                ConsultationFactory.createOrUpdateRdv(db,array[i]).then(function(result){
                    // console.log("rdv ajouté "+i)
                    // display local consultation list
                    ConsultationFactory.getConsultationLocalList(db).then(function(result){
                         var Consarray =[];
                        for (var i = 0; i<result.rows.length; i++) {
                            Consarray[i]=result.rows.item(i);
                         };// return array of objects 
                        $scope.consultationArray=Consarray;
                     //   console.log("consultation affiché ")
                    },function(reason){
                        console.log("error "+reason)
                    }) ;
                },function(reason){

                }) .finally(function() {
                   // Stop the ion-refresher from spinning
                   $scope.$broadcast('scroll.refreshComplete');
                 });

            }; 
            },function(reason){ 

            });

        }



    })


})