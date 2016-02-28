appContext.controller('ListConsultationController', function($scope){
	$scope.consultationArray=[];

		
	for(var i=0 ;i<=5 ;i++){
		$scope.consultationArray[i]={doctor : "doctor "+(i+1),maladie:"gg" , date:'10-05-2011'}
	}


})