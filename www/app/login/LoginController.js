appContext.controller('LoginController', function($scope,$rootScope,  $ionicPlatform, $ionicLoading, $state, $ionicHistory, LoginFactory,ionicToast,$ionicPush,$ionicPopup ){
    // for opening db:
    var db = null;
    var popup = "";
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
    if($ionicHistory.backView()!=null){
        console.log($ionicHistory.backView().stateName)
    if($ionicHistory.backView().stateName=="visiteurMenu.visiteurHome"){

    }else{
        $ionicHistory.clearHistory();
        $ionicHistory.nextViewOptions({ disableBack: true, disableAnimate: true, historyRoot: true });
    }
    }
    


    $scope.signin = function(user) {
        if (!user) {
          ionicToast.show('Veuillez remplir tout les champs', 'top', false, 2500);

        } else if(!user.email || user.email =="undefined" || ! validateEmail(user.email) )  {
            ionicToast.show('Veuillez introduire un email valide ', 'top', false, 2500);
        } else if (!user.password || user.password =="undefined") {
          ionicToast.show('Veuillez introduire un mot de passe', 'top', false, 2500);
        }else{

            LoginFactory.doLogin(user).success(function(data, status, headers, config ){

                if(data==0){
                  ionicToast.show('mot de passe ou email incorrecte', 'top', false, 2500);
                }else{
                    LoginFactory.createIdentifiantTable(db).then(function(result){
                        LoginFactory.setCredentials(db,user.email,user.password,data).then(function(result){
                            $rootScope.isAuthenticated=false;


// -----------------------------------------
                                // -----------
                            Ionic.io();
                            $ionicPush.init({
                                "debug": false,
                                "onNotification": function(notification) {
                                    console.warn(notification);
                                    popup = $ionicPopup.show({
                                        template: '<h4 style="text-align: center;vertical-align: middle; display:block ">' + notification.text + '<h4/><br><a class="button button-full" style="font-weight: bolder;" id="bwlogin" ng-click="ok()">Ok</a>',
                                        title: "Smart-H",
                                         scope: $scope,
                                    });
                                },
                                "onRegister": function(data) {

                                  //  deviceToken = $cordovaDevice.getUUID();
                                    localStorage.setItem('deviceId', data.token);
                                    localStorage.setItem('deviceToken', data.token);
                                    console.log("-----------------")
                                    console.log(JSON.stringify(data.token))
                                    console.log("-----------------")

                                }
                            });
                            $ionicPush.register();
                            // ---------
// -----------------------------------------




                            $state.go('synchronisation') ;
                        },function(reason){
                          ionicToast.show('Une erreur est survenue', 'top', false, 2500);
                        });
                    },function(){
                      ionicToast.show('Une erreur est survenue', 'top', false, 2500);
                    });


                    localStorage.setItem("isAuthenticated", true);

                }


            }).error(function(data, status, headers, config ){
                  console.log("erreur : login")
                 ionicToast.show('Une erreur est survenue', 'top', false, 2500);
             });
        };
    };


    $scope.hideToast = function(){
      ionicToast.hide();
    };
   

   $scope.ok = function() {
      if ("undefined" !== typeof(popup) )
        popup.close();
        
    };



    function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
})
