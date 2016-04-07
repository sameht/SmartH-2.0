appContext.controller('ListRdvController', function($scope){
	$scope.rdvArray=[];

		
	for(var i=0 ;i<=5 ;i++){
		$scope.rdvArray[i]={doctor : "doctor "+(i+1), date:'10-05-2011', heure:"10:30",local:"teboulba"}
	}


})