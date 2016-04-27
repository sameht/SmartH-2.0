appContext.controller('DoctorListController', function($scope, MyDoctorsFactory, $ionicPlatform,  ConnectionFactory){
    $ionicPlatform.ready(function() {



        /*************  BD ********************/
        if (window.cordova) {
            db = window.sqlitePlugin.openDatabase({
                name: "smartH",
                androidDatabaseImplementation: 2,
                location: 1
            }); // device
        } else {
            db = window.openDatabase("smartH", '1', 'desc', 1024 * 1024 * 5); // browser
        }



        /************ get Doctor listfrom local db *******************/
        MyDoctorsFactory.getLocalDoctorList(db).then(function(result) {
            var array = [];
            for (var i = 0; i < result.rows.length; i++) {
                array[i] = result.rows.item(i);
            };
            $scope.doctorArray = array;
            // console.log( $scope.doctorArray[0])

        },function(){

        })
    //ionicPlatform.ready
	})
})
