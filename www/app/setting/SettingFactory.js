appContext.factory('SettingFactory', function($http, $cordovaSQLite, $q){
	/**
     * create Rdv table
     */
    var createNotificationTable = function(db) {
        var deferred = $q.defer();
        var CreateQuery = 'CREATE TABLE IF NOT EXISTS notification (' +
            'id INTEGER PRIMARY KEY, ' +
            'canceledRDV text, editRDV text,comingRDV text)';
        $cordovaSQLite.execute(db, CreateQuery).then(
            function(result) {
                deferred.resolve(result);
            },
            function(reason) {
                deferred.reject(reason);
            });
        return deferred.promise;
    }

	var notificationInit = function() {
		localStorage.setItem("NotifyCanceledRDV", "true");
		localStorage.setItem("NotifyEditRDV", "true");
        localStorage.setItem("NotifyComingRDV", "false" );
    	localStorage.setItem("ComingRDVvalue", "false" );
	}
    return{
    	createNotificationTable : createNotificationTable,
    	notificationInit : notificationInit
    }

})