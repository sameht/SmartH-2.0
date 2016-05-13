appContext.factory('CompteFactory', function($q, $http,$cordovaSQLite){
  var getData=function(){
        var array =[{id : 10, name: "Anne",lastname :"Hathaway",city :"Tunis, TN",sexe:"femme",BD:"10/11/1982",address :"Tunis, TN",couv:"CNAM"}]

    return array
  }
	/**
   * get user list from server
   */
	var getUser=function(){
		var request = {
			url : "http://smarth.azurewebsites.net/api/WSUtilisateur/Get",
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
            },	*/															
           /*les données utilisé dans la requete*/
			data : {
				//id : id
			}
		}; 

	//	return $http(request)
    return getData()
	};


	  /**
     * create Rdv table
     */
    var createUserTable = function(db) {
      var deferred= $q.defer();
      var CreateQuery = 'CREATE TABLE IF NOT EXISTS user (' +
            'id INTEGER PRIMARY KEY, ' +
            'name text, lastname text,city text, sexe text,BD text, address text, couv text)';
      $cordovaSQLite.execute(db, CreateQuery).then(
          function(result) {
              deferred.resolve(result);
          },
          function(reason) {
              deferred.reject(reason);
          });
      return deferred.promise ;
    }


    /**
     * save the user into the user Table
     */
    var setUser = function(db,user) {
       var deferred= $q.defer();

      var query=" INSERT INTO user (id, name, lastname,city,sexe,BD,address,couv) VALUES (?,?,?,?,?,?,?,?) "
      $cordovaSQLite.execute(db, query, [user.id,user.name, user.lastname,user.city,user.sexe,user.BD,user.address,user.couv]).then(function(result) {
         deferred.resolve(result)
      }, function(reason) {
         deferred.reject(reason)
      });

      return deferred.promise; 
    } 
		/**
		* select user details by id
		*/
    var getUserById = function(db,id){

	      var deferred = $q.defer();
	      var query = 'SELECT * FROM user where id='+id;
	      //console.warn(query);
	      $cordovaSQLite.execute(db, query).then(function(result) {
	          //zone 2
	          deferred.resolve(result);
	        }, function(reason) {
	        	//TODO FIXME 
	          console.log("error select" + reason);
	          deferred.reject(reason);
	        });
		     
	      return deferred.promise;
  	};


 /**
   * get user list from local db
   */
  var getLocaluser=function(db){ 
     var deferred = $q.defer();
     var query="select * from user";
     $cordovaSQLite.execute(db,query).then(function(result){
        
      deferred.resolve(result);
    },function(reason){
        console.log("error: " +reason);
        deferred.reject(reason);
   })
   return deferred.promise;

  }

 /**
	* update user 
	*/
  	var updateUser = function (db,user){
      var deferred = $q.defer();
	  		var  query="update user set name='"+user.name+"', "+
  					"lastname='"+user.lastname+"', "+
  					"city='"+user.city +"', "+
  					"sexe='"+user.sexe+"', "+
  					"BD='"+user.BD+"', "+
  					"address='"+user.address+"', "+
  					"couv='"+user.couv+"' "+
  					"where id="+user.id+"";
          //  console.warn(query);
	  		$cordovaSQLite.execute(db, query).then(function(result){
          deferred.resolve(result);
	  		},function(reason){
          console.log("erreuuuuuuuuuuuuur update : " +reason )
	  			deferred.reject(reason)
	  		});
        return deferred.promise;
  	};

  	/**
  	* create or update user
  	*/
  	var createOrUpdateUser=function(db,user){
        var deferred=$q.defer();
        getUserById(db,user.id).then(function(result){ //return 1 row
          if(result.rows.length==1){ 
           // console.log("found===>update "+result.rows.length)
            updateUser(db,user).then(function(result){
             // console.log("updateeeeee ")
              deferred.resolve(result);
            },function(reason){
              console.log("erreur update : " +reason )
              deferred.reject(reason)
            });

          }else{
          //  console.log("not found===>insert")
            setUser(db,user).then(function(result){
           // console.log("ajoutéééééé")
            deferred.resolve(result);
            },function(reason){
               console.log("erreur ajout : " +reason )

              deferred.reject(reason)
            });
          }
      },function(reason){ 
          deferred.reject(reason)

      });
        return deferred.promise;
    }

        
  	


	return{
		getUser : getUser,
    	getLocaluser : getLocaluser,
		createUserTable: createUserTable,
		setUser : setUser,
		getUserById : getUserById,
		updateUser : updateUser,
		createOrUpdateUser : createOrUpdateUser
	}
})
