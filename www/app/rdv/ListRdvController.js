appContext.controller('ListRdvController', function($scope, RdvFactory, $ionicPlatform,  ConnectionFactory){

    $scope.rdvArray=[];
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


        // display local rdv list

        RdvFactory.getRdvLocalList(db).then(function(result){
             var array =[];
            for (var i = 0; i<result.rows.length; i++) {
                array[i]=result.rows.item(i);
             };// return array of objects 
            $scope.rdvArray=array;
        },function(reason){

        }) ;


        $scope.doRefresh = function(){
             $scope.rdvArray=[];
            RdvFactory.createRdvTable(db).then(function(){
           //  console.log("createRdvTable")
            for (var i = 0; i < RdvFactory.getRdvList().length; i++) {

                RdvFactory.createOrUpdateRdv(db,RdvFactory.getRdvList()[i]).then(function(result){
                    // console.log("rdv ajouté "+i)
                        RdvFactory.getRdvLocalList(db).then(function(result){
                        var array =[];
                        for (var i = 0; i<result.rows.length; i++) {
                             array[i]=result.rows.item(i);
                             };// return array of objects 
                            $scope.rdvArray=array;
                        },function(reason){

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

        
  /*      rdv=RdvFactory.getRdvList();
        for (var i = 0; i<rdv.length; i++) {
            RdvFactory.setRdv(db,rdv[i],function(){
                console.log("rdv ajouté")
            })
        };*/