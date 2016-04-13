appContext.factory('DoctorLocatorFactory', function($http,$q){
  /**
   * get doctor list from server
   */
	var getDoctorList=function(){
		var request = {
			url : "http://www.buzcard.fr/identification.aspx?request=identification",
			method :"Post",
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

            transformResponse: function(data) {
                var x2js = new X2JS();
                var json = x2js.xml_str2json(data);
                return json;
            },																
           /*les données utilisé dans la requete*/
			data : {
				//id : id
			}
		}; 

		//return $http(request)
		var array =[{id : 10, doctor: "Marty one",specialite:"généraliste",sexe:"homme",adresse :"1000 MONASTIR Av.Habib BOURGUIBA",tel:"71 75 001"},
          			{id : 11, doctor: "Marty two",specialite:"généraliste",sexe:"homme",adresse :"1000 MONASTIR Av.Habib BOURGUIBA",tel:"71 75 001"},
          			{id : 12, doctor: "Marty three",specialite:"généraliste",sexe:"homme",adresse :"1000 MONASTIR Av.Habib BOURGUIBA",tel:"71 75 001"},
          			{id : 13, doctor: "Marty threee",specialite:"généraliste",sexe:"homme",adresse :"1000 MONASTIR Av.Habib BOURGUIBA",tel:"71 75 001"}
		] //+ spécialité de médecin

		return array
	};

    /**
     * create doctor table
     */
    var createDoctorTable = function(db) {
      var deferred= $q.defer();
      var CreateQuery = 'CREATE TABLE IF NOT EXISTS doctor (' +
            'id INTEGER PRIMARY KEY, ' +
            'doctor text, specialite text,sexe text, adresse text, tel text)';
      $cordovaSQLite.execute(db, CreateQuery).then(
          function(result) {
              deferred.resolve(result);
          },
          function(reason) {
          	console.log("error : "+reason)
            deferred.reject(reason);
          });
      return deferred.promise ;
    }
    /**
     * save the doctor into the doctor Table
     */
    var setDoctor = function(db,doc) {
       var deferred= $q.defer();

      var query=" INSERT INTO doctor (id, doctor, specialite,sexe,adresse,tel) VALUES (?,?,?,?,?,?) "
      $cordovaSQLite.execute(db, query, [doc.id,doc.doctor, doc.specialite,doc.sexe,doc.adresse,doc.tel]).then(function(result) {
         deferred.resolve(result)

      }, function(reason) {
      	console.log("error : "+reason)
         deferred.reject(reason)
      });

      return deferred.promise; 
    } 
		/**
		* select rdv details by id
		*/
    var getRdvById = function(db,id){

	      var deferred = $q.defer();
	      var query = 'SELECT * FROM rdv where id='+id;
	      //console.warn(query);
	      $cordovaSQLite.execute(db, query).then(function(result) {
	          //zone 2
	          deferred.resolve(result);
	        }, function(reason) {
	        	//TODO FIXME 
	          console.log("error " + reason);
	          deferred.reject(reason);
	        });
		     
	      return deferred.promise;
  	};

  /**
   * get doctor list from local db
   */
  var getDoctorLocalList=function(db){ 
     var deferred = $q.defer();
     var query="select * from doctor ";
     $cordovaSQLite.execute(db,query).then(function(result){

        
      deferred.resolve(result);
    },function(reason){
        console.log("error: " +reason);
        deferred.reject(reason);
   })
   return deferred.promise;

  }

   /**
	* update rdv 
	*/
  	var updateDoctor = function (db,doc){
      var deferred = $q.defer();
	  		var  query="update doctor set doctor='"+doc.doctor+"', "+
  					"specialite='"+doc.specialite+"', "+
  					"sexe='"+doc.sexe +"', "+
            		"adresse='"+doc.adresse+"', "+
  					"tel='"+doc.tel+"'"+
  					"where id="+doc.id+"";
           // console.warn(query);
	  		$cordovaSQLite.execute(db, query).then(function(result){
          deferred.resolve(result);
	  		},function(reason){
	       	    console.log("error: " +reason);
	  			deferred.reject(reason)
	  		});
        return deferred.promise;
  	};

  	/**
  	* create or update doctor
  	*/
  	var createOrUpdateDoctor=function(db,doc){
        var deferred=$q.defer();
        getDoctorById(db,doc.id).then(function(result){ //return 1 row
          if(result.rows.length==1){ 
           // console.log("found===>update "+result.rows.length)
            updateDoctor(db,doc).then(function(result){
              //console.log("doc updateeeeee ")
              deferred.resolve(result);
            },function(reason){
              deferred.reject(reason)
            });

          }else{
          //  console.log("not found===>insert")
            setDoctor(db,doc).then(function(result){
            //console.log("doc ajoutéééééé")
            deferred.resolve(result);
            },function(reason){
              deferred.reject(reason)
            });
          }
      },function(reason){ 
          deferred.reject(reason)

      });
        return deferred.promise;
    }


	return{
		getDoctorList : getDoctorList,
		createDoctorTable : createDoctorTable,
		getRdvById : getRdvById,
		getDoctorLocalList : getDoctorLocalList,
		updateDoctor : updateDoctor,
		createOrUpdateDoctor : createOrUpdateDoctor
  
	}
})