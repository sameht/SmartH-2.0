appContext.controller('SettingController', function($scope,$ionicPlatform,NotificationFactory ){

	var secParJour=86400;
	$ionicPlatform.ready(function() {

		$scope.annuler=localStorage.getItem("NotifyCanceledRDV")
		$scope.canceledRDV = { checked: $scope.annuler }; //false

		$scope.modifier=localStorage.getItem("NotifyEditRDV")
		$scope.editRDV = { checked: $scope.modifier };


		$scope.ProchainRdv=localStorage.getItem("NotifyComingRDV")
    	$scope.comingRDV={ checked: $scope.ProchainRdv };

    	$scope.value=localStorage.getItem("ComingRDVvalue")
    	$scope.choice = { checked: $scope.value };

	})


	
	var alert_confirm=function (){

      customMsgBox("This is my title","how are you?",64,0,0,0);
	}
	/*---------------------------------------------*/

	/**
	 * rendez-vous annulé 
	 */
    console.log("trueeeeeee "+$scope.canceledRDV.checked +" "+typeof($scope.canceledRDV.checked))
	$scope.canceled=function(){

			if($scope.canceledRDV.checked==true){ // if true 
				localStorage.setItem("NotifyCanceledRDV", "true");
				alert_confirm()
				if (window.cordova){ //device
					NotificationFactory.delayedNotification(1,'Un rendez-vous est annulé');
				} else {
					console.log('Notification : activé');
				} 
				
			}else{
				localStorage.setItem("NotifyCanceledRDV", "false");
				console.log('Notification : désactivé'); 
			}
		};



	/*----------------------------------*/
	/**
	 * rendez-vous modifié
	 */
	$scope.edit=function(){
			if($scope.editRDV.checked==true){
				localStorage.setItem("NotifyEditRDV", "true");
				if (window.cordova){ //device
					NotificationFactory.delayedNotification(3,'Un rendez-vous est modifié');
				} else {
					console.log('Notification : activé');
				}	 
			}else{
				localStorage.setItem("NotifyEditRDV", "false");
				console.log('Notification : désactivé'); 
			}
		};

	/*---------------------------------------------------------------*/

	/**
	 * rendez-vous à venir
	 */


    $scope.notification=function(){

		if($scope.comingRDV.checked==true){
			localStorage.setItem("NotifyComingRDV", "true");
			
		}else{ // annuler tout la notification 
			localStorage.setItem("NotifyComingRDV", "false");
			localStorage.setItem("ComingRDVvalue", "false" );

			if (window.cordova){ //créer une notification local avec id =1
				if(NotificationFactory.PresentNotification(2)){
		  		// 	NotificationFactory.cancelSingleNotification(2)
		  		 }
		  	} else {
		  		
				console.log('cancel Notification ');
			} 

		}
    };

    /**
     * Check box value
     */

	$scope.notifyMe=function(){
		/**** button B1 ****/
		if($scope.choice.checked== 'B1'){
			localStorage.setItem("ComingRDVvalue", "B1" );
			if (window.cordova){
				if(NotificationFactory.PresentNotification(2)){
					NotificationFactory.updateSingleNotification(2,1*secParJour,'vous avez un rendez-vous demain!');
					console.log('update 10');
					localStorage.setItem("ComingRDVvalue", "false" );
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
			localStorage.setItem("ComingRDVvalue", "B2" );
			if (window.cordova){
				if(NotificationFactory.PresentNotification(2)){
				//	NotificationFactory.updateSingleNotification(2,2*secParJour,'This is updated text 2!');
					console.log('update 20');
				}else{
					//NotificationFactory.delayedNotification(2,'add delayedNotification 20 sec');
					console.log('add 20');
				}
			} else {
				console.log('local Notification 2');
			      }	 
		} else  

		/**** button B3***/

		if($scope.choice.checked== 'B3'){
			localStorage.setItem("ComingRDVvalue", "B3" );
			if (window.cordova){
				if(NotificationFactory.PresentNotification(2)){
					//NotificationFactory.updateSingleNotification(2,3*secParJour,'This is updated text 3!');
					console.log('update 30');
				}else{
					//NotificationFactory.delayedNotification(2,'add delayedNotification 30 sec');
					console.log('add 30');
				}
			} else {
				console.log('local Notification 3');
			      }	 
		}

	}
	


	/*---------------------------------------------------------------*/

	

})






