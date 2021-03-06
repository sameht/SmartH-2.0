appContext.factory('PharmacyLocatorFactory', function($http,$q,$cordovaSQLite){
  var getArray=function (){
    var array =[{id : 10, pharmacien: "Marty one",pharmacy:"nom de pharmacie1"type:"généraliste",adresse :"1000 MONASTIR Av.Habib BOURGUIBA",tel:"71 75 001",distance:20},
                {id : 11, pharmacien: "Marty 2",pharmacy:"nom de pharmacie2"type:"généraliste",adresse :"1000 MONASTIR Av.Habib BOURGUIBA",tel:"71 75 001",distance:20},
                {id : 12, pharmacien: "Marty 3",pharmacy:"nom de pharmacie3"type:"généraliste",adresse :"1000 MONASTIR Av.Habib BOURGUIBA",tel:"71 75 001",distance:20},
                {id : 13, pharmacien: "Marty 4",pharmacy:"nom de pharmacie4"type:"généraliste",adresse :"1000 MONASTIR Av.Habib BOURGUIBA",tel:"71 75 001",distance:20},
               
    ] //+ spécialité de médecin
    return array;
  }
  /**
   * get doctor list from server
   */
	var getPharmacyListByDistance=function(dist,currentPosition){
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
		

		return getArray()
	};

  /**
   * get doctor list from server
   */
  var getPharmacyList=function(pharmacy,pharmacien,type){
    var request = {
      url : "http://www.buzcard.fr/identification.aspx?request=identification",
      method :"Post",
      cache : false,
      headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
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
       /* name : name ,
        lastname : lastname,
        speciality : speciality,
        gendre : gendre*/
      }
    }; 

    //return $http(request)

    return getArray()
  };


    /**
     * create doctor table
     */
    var createPharmacyTable = function(db) {
      var deferred= $q.defer();
      var CreateQuery = 'CREATE TABLE IF NOT EXISTS pharmacy (' +
            'id INTEGER PRIMARY KEY, ' +
            'doctor text, specialite text,sexe text, adresse text, tel text,distance text)';
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
    var setPharmacy = function(db,doc) {
       var deferred= $q.defer();

      var query=" INSERT INTO doctor (id, doctor, specialite,sexe,adresse,tel,distance) VALUES (?,?,?,?,?,?,?) "
      $cordovaSQLite.execute(db, query, [doc.id,doc.doctor, doc.specialite,doc.sexe,doc.adresse,doc.tel,doc.distance]).then(function(result) {
         deferred.resolve(result)

      }, function(reason) {
      	console.log("error : "+reason)
         deferred.reject(reason)
      });

      return deferred.promise; 
    } 

	/**
	* select doctor details by id from local db
	*/
    var getPharmacyById = function(db,id){

	      var deferred = $q.defer();
	      var query = 'SELECT * FROM doctor where id='+id;
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
  var getPharmacyLocalList=function(db){ 
      var deferred = $q.defer();
      var query="select * from doctor ";
      console.warn(query);
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
  	var updatePharmacy = function (db,doc){
        var deferred = $q.defer();
	  		var  query="update doctor set doctor='"+doc.doctor+"', "+
  					"specialite='"+doc.specialite+"', "+
  					"sexe='"+doc.sexe +"', "+
            		"adresse='"+doc.adresse+"', "+
            "tel='"+doc.tel+"', "+
  					"distance='"+doc.distance+"'"+
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
  	var createOrUpdatePharmacy=function(db,doc){
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
    /**
     *Calculate distance and return distance
     */
    var calculateDistance=function(origin , doctor){
      var deferred=$q.defer();
      var service = new google.maps.DistanceMatrixService;
              service.getDistanceMatrix({
                origins: [origin],
                destinations: [doctor.adresse],
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.METRIC, // distance
                avoidHighways: false,
                avoidTolls: false
                      // resultat du calcule
                }, function(response, status){
                  if(status==google.maps.DistanceMatrixStatus.INVALID_REQUEST){
                        alert('Error was: ' + status);
                        deferred.reject(reason);
                  }else
                      if (status !== google.maps.DistanceMatrixStatus.OK) {
                        alert('Error was: ' + status);
                        deferred.reject(reason)
                      } else {
                          var originList = response.originAddresses;
                          var destinationList = response.destinationAddresses;
                           var results = response.rows[0].elements;
                           var distance=results[0].distance.value;
                          
                           deferred.resolve(distance);
                      }
                })
       return deferred.promise;
    }


    /**
     * delete all records from doctor table
     */
    var emptyPharmacyTable = function(db) {

        var deferred=$q.defer();
        var query = "DROP Table IF EXISTS doctor ";
        $cordovaSQLite.execute(db, query).then(function(result) {
      
            deferred.resolve(result);
        }, function(reason) {
            deferred.reject(reason);
        });
         return deferred.promise;

    };
    /**
     * insert an array of doctors into doctor
     */
    var insertBulkIntoPharmacyTable = function(db, doctorArray) {

      var deferred=$q.defer();
      var insertQuery = "INSERT INTO doctor " + 
        " SELECT '" + doctorArray[0].id  + "' AS 'id', '" +
          doctorArray[0].doctor  + "' AS 'doctor','" + 
          doctorArray[0].specialite + "' AS 'specialite','" + 
          doctorArray[0].sexe + "' AS 'sexe','"+
          doctorArray[0].adresse + "' AS 'adresse', '" + 
          doctorArray[0].tel + "' AS 'tel','" + 
          doctorArray[0].distance+"' AS 'distance' ";

      for (var i =1; i < doctorArray.length; i++) {

        insertQuery = insertQuery + "  UNION SELECT '"
            + doctorArray[i].id + "','"
            + doctorArray[i].doctor + "', '"
            + doctorArray[i].specialite + "','"
            + doctorArray[i].sexe + "', '"
            + doctorArray[i].adresse + "', '"
            + doctorArray[i].tel + "', '"
            +doctorArray[i].distance +"'";
      }

  

        $cordovaSQLite.execute(db, insertQuery).then(function(result) {
            
                deferred.resolve(result);

            }, function(reason) {
               deferred.reject(reason);
            });
         return deferred.promise;
      }

  function getCurrentPosition() {
      var deferred = $q.defer();
      console.log('getCurrentPosition function')
      if (!navigator.geolocation) {
          $ionicLoading.hide();
          console.log('geolocation not supported')
          deferred.reject('Geolocation not supported.');
      } else {
          console.log('geolocation is supported')
          navigator.geolocation.getCurrentPosition(
              function (position) {
                  console.log("search current position 1")
                  var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                  console.log("search current position 2")
                  deferred.resolve(latLng);
              },
              function (err) {

                  $ionicLoading.hide();
                  deferred.reject(err);
              });
      }

        return deferred.promise;
    }





    

	return{
		getPharmacyListByDistance : getPharmacyListByDistance,
    getPharmacyList : getPharmacyList,
		createPharmacyTable : createPharmacyTable,
		setPharmacy : setPharmacy,
    getPharmacyById : getPharmacyById,
		getPharmacyLocalList : getPharmacyLocalList,
		updatePharmacy : updatePharmacy,
		createOrUpdatePharmacy : createOrUpdatePharmacy,
    calculateDistance : calculateDistance,
    emptyPharmacyTable : emptyPharmacyTable,
    insertBulkIntoPharmacyTable : insertBulkIntoPharmacyTable,
    getCurrentPosition : getCurrentPosition

	}
})