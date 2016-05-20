appContext.factory('LoginFactory', function($http, $cordovaSQLite, $q){
	
	var login = function (user){
	
   //user.email = "demo";
		//user.password = "demo";
		var request = {
			url : "http://smarth.azurewebsites.net/api/WSAuthentification/Get?Login="+user.email+"&Password="+user.password,
      method :"Get",
			cache : false,
			headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    //'token': kjkjkjljljkjk
                },
			transformRequest: function(obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },

           /* transformResponse: function(data) {
                var x2js = new X2JS();
                var json = x2js.xml_str2json(data);
                return json;
            },*/
			data : {
				email : user.email,
				hash : user.password 
			}
		};


		return $http(request)
	}


    /**
     * create identifiant table
     */
    var createIdentifiantTable = function(db) {
        var deferred=$q.defer();
        var CreateQuery = 'CREATE TABLE IF NOT EXISTS identifiant (' +
            'id INTEGER PRIMARY KEY, ' +
            'email text, password text,userId text)';
        $cordovaSQLite.execute(db, CreateQuery).then(
            function(result) {
               deferred.resolve();
            },
            function(reason) {
               deferred.reject();
            });
        return deferred.promise;    
    } 

    /**
     * save the user credentials into the identifiant Table
     */
    var setCredentials = function(db, email, password,userId) {
        var deferred=$q.defer();
        $cordovaSQLite.execute(db, " INSERT INTO identifiant (id, email, password,userId) VALUES (?,?,?,?) ", [1, email, password,userId]).then(function(result) {
            deferred.resolve();

        }, function(reason) {
            deferred.reject();
        });

        return deferred.promise;
 
    }

      /**
       * the login server call
       */
      var logout = function() {
        return     $http.get("http://buzcard.fr/identification.aspx?request=leave");
      };

    /**
     * delete all records from identifiant table
     */
    var emptyIdentifiantTable = function(db) {

        var deferred=$q.defer();
        var query = "DELETE FROM identifiant where id = 1";
        $cordovaSQLite.execute(db, query).then(function(result) {
            deferred.resolve(result);
        }, function(reason) {
            deferred.reject(reason);
        });
         return deferred.promise;

    };

    /**
     * GET the user credentials into the USER Table
     */
    var selectCredentials = function(db) {
        var deferred=$q.defer();
        $cordovaSQLite.execute(db, "SELECT name FROM sqlite_master WHERE type='table' AND name='identifiant';").then(function(results) {
            if (results.rows.length > 0) {
                $cordovaSQLite.execute(db, "SELECT * FROM identifiant WHERE id=1").then(function(res) {
                    deferred.resolve(res);
                }, function(error) {
                    deferred.reject(error);
                });
            } else {
                console.log('table nexiste pas');
                deferred.resolve(0);
            }
        }, function(reason) {
            deferred.reject(reason);
        });
        return deferred.promise;
    };

    
    /**
     * the factory returns
     */
	return {
		doLogin : login,
		createIdentifiantTable : createIdentifiantTable,
		setCredentials : setCredentials,
		logout : logout,
		emptyIdentifiantTable : emptyIdentifiantTable,
    selectCredentials : selectCredentials
	}
})