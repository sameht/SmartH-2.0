appContext.factory('PopupFactory', function($ionicPopup){

	var myPopup=function(msg){
		var popup = $ionicPopup.alert({
        title: 'Problème!',
        subTitle: msg

      });
	}

	return {myPopup : myPopup}
})