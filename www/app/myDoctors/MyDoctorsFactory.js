appContext.factory('MyDoctorsFactory', function($http, $cordovaSQLite,$rootScope ,$q){
  var docInfo=function(id){
    array=[]
    var doc1={id : 1, doctor: "GAALOUL HECHMI",specialite:"Ophtalmologie",sexe:"Homme",adresse :"SOUSSE MEDINA, AV. LEOPOLD SEDAR SENGHOR",tel:"73226453"}
    var doc2={id : 2, doctor: "DEBBICHE NOUREDDINE",specialite:"Pediatrie",sexe:"Homme",adresse :"1 BIS, RUE MOUSSA IBN NOUCAIR",tel:" 71287503",distance:30}
    var doc3={id : 3, doctor: "BEN DHIA CHEBIL",specialite:" Psychiatrie",sexe:"Homme",adresse :"SOUSSE MEDINA, AV. LEOPOLD SEDAR SENGHOR",tel:" 73226626",distance:15}
    var doc4= {id : 4, doctor: "KHALSI MOHAMED EL AZIZ",specialite:"Dermatologie",sexe:"Homme",adresse :"ARIANA, RUE CHEIKH M.ZAGHOUANI",tel:"71 75 001",distance:17}
    var doc5= {id : 5, doctor: "HAFSA IBTISSEM",specialite:"Pediatrie",sexe:"Femme",adresse :"LA MARSA,RUE DE CARTHAGE",tel:"71747832",distance:17}
    var doc6= {id : 6, doctor: "MABROUK JAAFAR",specialite:"Pediatrie",sexe:"homme",adresse :"TEBOULBA, AV. HABIB BOURGUIBA ",tel:"73 75 001",distance:17}
    switch(id){
      case 1 : array.push(doc1); break;
      case 2 : array.push(doc2); break;
      case 3 : array.push(doc3); break;
      case 4 : array.push(doc4) ;break;
      case 5 : array.push(doc5) ;break;
      case 6 : array.push(doc6) ;break;
      
    }

    return array ;
  }

  var getData=function(){
    var array =[{id : 1, doctor: "Marty one",specialite:"généraliste",sexe:"homme",adresse :"1000 MONASTIR Av.Habib BOURGUIBA",tel:"71 75 001"},
              {id : 2, doctor: "Marty two",specialite:"généraliste",sexe:"homme",adresse :"Bab Bhar, Gouvernorat de Tunis, Tunisie",tel:"71 75 001"},
              {id : 3, doctor: "Marty three",specialite:"généraliste",sexe:"homme",adresse :"Téboulba, Monastir, Tunisie",tel:"71 75 001"},
              {id : 4, doctor: "Marty four",specialite:"généraliste",sexe:"homme",adresse :"Moknine, Monastir, Tunisie",tel:"71 75 001"},
              {id : 5, doctor: "Marty five",specialite:"généraliste",sexe:"homme",adresse :"Moknine, Monastir, Tunisie",tel:"71 75 001"},
              {id : 6, doctor: "Marty six",specialite:"généraliste",sexe:"homme",adresse :"Moknine, Monastir, Tunisie",tel:"71 75 001"}
        ] 
    return array ;
  }



  /**
   *get goctor by id from server
   */
  var getDoctorList= function(id){

    var deferred = $q.defer();

    var request = {
    url : "http://smarth.azurewebsites.net/smarth/me-doc.php",
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

                                     
       /*les données utilisé dans la requete*/
    data : {
      IdPatient : id
    }
  }; 

  return $http(request)


   /* setTimeout(function() {
      deferred.resolve(getData())

    }, 1500);
  
      return deferred.promise;
*/
  }
	/**
	 *get goctor by id from server
	 */
	var getDoctorById= function(id){

    var deferred = $q.defer();

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
	//var array =[{id : 10, doctor: "Marty one",specialite:"généraliste",sexe:"homme",adresse :"1000 MONASTIR Av.Habib BOURGUIBA",tel:"71 75 001"}] 

    setTimeout(function() {
      var doctor = docInfo(id);
      deferred.resolve(doctor)

    }, 100);
	//return 
      return deferred.promise;

	}

	/**
     * create myDoctors table
     */

    var createMyDoctorsTable = function(db) {
	    var deferred= $q.defer();
	    var CreateQuery = 'CREATE TABLE IF NOT EXISTS myDoctors (' +
	          'id INTEGER PRIMARY KEY, ' +
	          'name text,lastname text , specialite text,sexe text, adresse text, tel text)';
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

        var query=" INSERT INTO myDoctors (id, name, lastname, specialite,sexe,adresse,tel) VALUES (?,?,?,?,?,?,?) "
        $cordovaSQLite.execute(db, query, [doc.id,doc.name,doc.lastname , doc.specialite,doc.sexe,doc.adresse,doc.tel,]).then(function(result) {
        	deferred.resolve(result)

        }, function(reason) {
      		console.log(reason)
         	deferred.reject(reason)
        });

        return deferred.promise; 
    } 

	/**
	* select doctor details by id from local db
	*/
    var getLocalDoctorById = function(db,id){

        var deferred = $q.defer();
        var query = 'SELECT * FROM myDoctors where id='+id;
        //console.warn(query);
        $cordovaSQLite.execute(db, query).then(function(result) {
        	deferred.resolve(result);
        }, function(reason) {
        	console.log("error " + reason);
            deferred.reject(reason);
        });
		     
	    return deferred.promise;
  	};
  /**
   * get doctor list from local db
   */
  var getLocalDoctorList=function(db){ 
      var deferred = $q.defer();
      var query="select * from myDoctors ";
      //console.warn(query);
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
	  		var  query="update myDoctors set name='"+doc.name+"', "+
            "lastname='"+doc.lastename+"', "+
  					"specialite='"+doc.specialite+"', "+
  					"sexe='"+doc.sexe +"', "+
            		"adresse='"+doc.adresse+"', "+
            		"tel='"+doc.tel+"' "+
  					"where id="+doc.id+"";
            console.warn(query);
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

        getLocalDoctorById(db,doc.id).then(function(result){ //return 1 row
          if(result.rows.length==1){ 
           // console.log("found===>update "+result.rows.length)
            updateDoctor(db,doc).then(function(result){
              //console.log("doc updateeeeee ")
              deferred.resolve(result);
            },function(reason){
              console.log(" updateDoctor error ")
              deferred.reject(reason)
            });

          }else{
          //  console.log("not found===>insert")
            setDoctor(db,doc).then(function(result){
            //console.log("doc ajoutéééééé")
            deferred.resolve(result);
            },function(reason){
              console.log(" setDoctor error ")
              deferred.reject(reason)
            });
          }
         },function(reason){ 
          console.log("getLocalDoctorById error ")
          deferred.reject(reason)

        });
        return deferred.promise;
    }


    var doctorAppelRecur=function (db,counter, doctorIdList, callBack) {
        var length = doctorIdList.length;
        //console.warn(doctorIdList)
        if (counter < length) { 
            getDoctorById(doctorIdList[counter]).then(function(doc){
                createOrUpdateDoctor(db, doc[0]).then(function(result) {
                    counter++;
                    doctorAppelRecur(db,counter, doctorIdList, callBack);
                }, function(reason) {
                  console.log(reason)
                    return callBack(false)
                });
            },function(){

            })


        } else {
            return callBack(true)
        }

}



    var DoctorListAppelRecur=function (db,counter, doctorList, callBack) {
        var length = doctorList.length;
        //console.warn(doctorIdList)
        if (counter < length) { 

                createOrUpdateDoctor(db, doctorList[counter]).then(function(result) {
                    
                    counter++;
                    DoctorListAppelRecur(db,counter, doctorList, callBack);
                }, function(reason) {
                  console.log(reason)
                    return callBack(false)
                });
        


        } else {
            return callBack(true)
        }

}

    /**
     * delete all records from user table
     */
    var emptyMyDoctorsTable = function(db) {

        var deferred = $q.defer();
        var query = "DROP Table IF EXISTS myDoctors ";
        $cordovaSQLite.execute(db, query).then(function(result) {

            deferred.resolve(result);
        }, function(reason) {
            deferred.reject(reason);
        });
        return deferred.promise;

    };


	return {
    getDoctorList : getDoctorList,
		getDoctorById : getDoctorById,
		createMyDoctorsTable : createMyDoctorsTable,
		setDoctor : setDoctor,
		getLocalDoctorById : getLocalDoctorById,
		getLocalDoctorList : getLocalDoctorList,
		updateDoctor : updateDoctor,
		createOrUpdateDoctor : createOrUpdateDoctor,
    doctorAppelRecur : doctorAppelRecur,
    DoctorListAppelRecur : DoctorListAppelRecur,
    emptyMyDoctorsTable : emptyMyDoctorsTable
	}
})
