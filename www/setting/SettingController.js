appContext.controller('SettingController', function($scope,NotificationFactory){
	
    $scope.canceledRDV = { checked: false };

	$scope.canceled=function(){
			if($scope.canceledRDV.checked){
				if (window.cordova){
					NotificationFactory.singleNotification(1,'Un rendez-vous est annulé');
				} else {
					console.log('Notification : activé');
				}	 
			}else
			   {console.log('Notification : désactivé'); }
		};



    $scope.choice = { checked: '' };

	$scope.notifyMe=function(){
		if($scope.choice.checked== 'B1'){
			if (window.cordova){
				NotificationFactory.delayedNotification(2,'Vous avez un rendez-vous');
			} else {
				console.log('local Notification 1');
			      }	 
		} else  
		if($scope.choice.checked== 'B2'){
				
			if (window.cordova){
				NotificationFactory.delayedNotification(3,'Vous avez un rendez-vous');
			} else {
				console.log('local Notification 2');
			}	 
				
	    }else

		if($scope.choice.checked== 'B3'){
				
			if (window.cordova){
				NotificationFactory.delayedNotification(4,'Vous avez un rendez-vous');
			} else {
				console.log('local Notification 3');
			}	 
		}
			
		


		}
		

})