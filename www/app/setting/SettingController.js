appContext.controller('SettingController', function($scope,NotificationFactory){
	
	/*********  rendez-vous annulé  ****************/
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

	/************ rendez-vous à venir ****************/


    $scope.comingRDV={ checked: false };

    $scope.notification=function(){
		if($scope.comingRDV.checked==false){
			if (window.cordova){
				if(NotificationFactory.PresentNotification(2)){
		  		 	NotificationFactory.cancelSingleNotification(2)
		  		 }
		  	} else {
				console.log('cancel Notification ');
			} 
		}
    }




    $scope.choice = { checked: '' };

	$scope.notifyMe=function(){
		/**** button B1 ****/
		if($scope.choice.checked== 'B1'){
			if (window.cordova){
				if(NotificationFactory.PresentNotification(2)){
					NotificationFactory.updateSingleNotification(2,10,'This is updated text 1!');
					console.log('update 10');
				}else{
					NotificationFactory.delayedNotification(2,'add delayedNotification 10 sec');
					console.log('add 10');
				}
			} else {
				console.log('local Notification 1');
			      }	 
		} else  
		/**** button B2***/
		if($scope.choice.checked== 'B2'){
			if (window.cordova){
				if(NotificationFactory.PresentNotification(2)){
					NotificationFactory.updateSingleNotification(2,20,'This is updated text 2!');
					console.log('update 20');
				}else{
					NotificationFactory.delayedNotification(2,'add delayedNotification 20 sec');
					console.log('add 20');
				}
			} else {
				console.log('local Notification 2');
			      }	 
		} else  

		/**** button B3***/

		if($scope.choice.checked== 'B3'){
			if (window.cordova){
				if(NotificationFactory.PresentNotification(2)){
					NotificationFactory.updateSingleNotification(2,30,'This is updated text 3!');
					console.log('update 30');
				}else{
					NotificationFactory.delayedNotification(2,'add delayedNotification 30 sec');
					console.log('add 30');
				}
			} else {
				console.log('local Notification 3');
			      }	 
		}

	}
		

})