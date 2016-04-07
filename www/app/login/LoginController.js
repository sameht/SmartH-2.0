appContext.controller('LoginController', function($scope,  $ionicPlatform, $ionicLoading, $state, $ionicHistory, LoginFactory ){
    // for opening db:
    var db = null;
    $ionicPlatform.ready(function() {
        /**
         * create/open DB
         */
        if (window.cordova) {
            db = window.sqlitePlugin.openDatabase({name : "smartH" , androidDatabaseImplementation: 2}); // device
        } else {
            db = window.openDatabase("smartH", '1', 'desc', 1024 * 1024 * 5); // browser

        }

    });


    $ionicHistory.clearHistory();
    $ionicHistory.nextViewOptions({ disableBack: true, disableAnimate: true, historyRoot: true });
//$rootScope.$viewHistory.backView = null;
    
    $scope.signin = function(user) {
        console.log(user)
        if (!user) {

            $ionicLoading.show({
            template: 'Veuillez remplir tout les champs'
            });

            setTimeout(function() {
                $ionicLoading.hide()
            }, 1700);
            
           

        } else if (!user.password || user.password =="undefined") {
            $ionicLoading.show({
                template: 'Veuillez introduire votre mot de pass'
            });

            setTimeout(function() {
                $ionicLoading.hide()
            }, 1700);

        } else if(!user.email || user.email =="undefined" || ! validateEmail(user.email) )  {
            $ionicLoading.show({
                template: 'Veuillez introduire votre email'
            });

            setTimeout(function() {
                $ionicLoading.hide()
            }, 1700);
        }else{

            //here goes your code
   
            LoginFactory.doLogin(user).success(function(data, status, headers, config ){
                if(data.identification==0){
                    console.log("mot de passe ou email incorrecte")
                }else{
                    LoginFactory.createIdentifiantTable(db,function(CallBack){});
                    LoginFactory.setCredentials(db,user.email,user.password,data.identification, function(callBack){
                        $state.go('menu.home') ;
                    })
                    localStorage.setItem("isAuthenticated", true);

                }
                

            }).error(function(a,b,c,d){

                 $ionicLoading.show({ template: 'pas de réponse du serveur'  });
             });
        };
    };



    function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
})