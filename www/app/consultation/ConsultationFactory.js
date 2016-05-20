appContext.factory('ConsultationFactory', function($q,$http,$cordovaSQLite){
    var getData=function(){
        var array =[{id : 15, idDoc:1, doctor: "GAALOUL HECHMI", specialite:"Ophtalmologie",date:"November 05, 2015",maladie:" infection oculaire",medicament:"Almide",prix:"60",description:" -"},
          {id : 70,idDoc:1, doctor: "GAALOUL HECHMI", specialite:"Ophtalmologie",date:"November 20, 2015",maladie:"DMLA",medicament:"-",prix:"40",description:"-"},
          {id : 90,idDoc:2, doctor: " DEBBICHE NOUREDDINE", specialite:"Pediatrie",date:"Septembre 17, 2015",maladie:"Allergie",medicament:"Dafalgan",prix:"60",description:"-"},
          {id : 95,idDoc:4, doctor: "KHALSI MOHAMED EL AZIZ", specialite:"Dermatologie",date:"Janvier 05, 2016",maladie:"Traitement des cicatrices",medicament:"Cicaflate",prix:"50",description:"-"},
          {id : 96,idDoc:4, doctor: "KHALSI MOHAMED EL AZIZ", specialite:"Dermatologie",date:"Mars 25, 2016",maladie:"Acné",medicament:"Curacné",prix:"45",description:"traitement qui dure 8 mois avec suivi mensuel"}
        ]

    return array
  }
	/**
	 * Get consultation list from server
	 */
	 var getConsultationList=function(id){

	 	var deferred = $q.defer()
	 	var request={
      //url : "http://smarth.azurewebsites.net/api/WSConsultation/Get?Id=1",
	 		url : "http://smarth.azurewebsites.net/smarth/consult-list.php",
			//method :"Get",
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

          																
           /*les données utilisé dans la requete*/
			data : {
				//id : id
        "IdPatient": "12",
        "Visibilite": "Moi uniquement"
			}
		};
				return $http(request)

				/*setTimeout(function() {
					
					deferred.resolve(getData());
				}, 1500);
		return deferred.promise*/ 
	 
}
	/**
	 *Create consultation table
	 */
	var createConsultationTable=function(db){
		var deferred=$q.defer();
		var query="CREATE TABLE IF NOT EXISTS consultation ("+
			"id INTEGER PRIMARY KEY ,"+
			"idDoc INTEGER, doctor text, specialite text, date text,maladie text, medicament text, prix text, description text)"
		$cordovaSQLite.execute(db,query).then(function(result){
			deferred.resolve(result);
		}, function(reason){
				console.log("error ")
      	console.log(reason)
			deferred.reject(reason);

		})
		return deferred.promise;
	}
	/**
	 * save the consultation into the consultation Table 
	 */
	 var setConsultation=function(db,cons){
	 var deferred= $q.defer();

      var query=" INSERT INTO consultation (id, idDoc, doctor, specialite, date,maladie,medicament,prix,description) VALUES (?,?,?,?,?,?,?,?,?) "
      //console.warn(query);
      $cordovaSQLite.execute(db, query, [cons.id, cons.idDoc, cons.doctor, cons.specialite, cons.date,cons.maladie,cons.medicament,cons.prix,cons.description]).then(function(result) {
         deferred.resolve(result)

      }, function(reason) {
      	console.log("error ")
      	console.log(reason)
         deferred.reject(reason)
      });

      return deferred.promise; 
	 }

   /**
	* select consultation details by id
	*/
    var getConsultationById = function(db,id){

	      var deferred = $q.defer();
	      var query = 'SELECT * FROM consultation where id='+id;
	      console.warn(query);
	      $cordovaSQLite.execute(db, query).then(function(result) {
	          //zone 2
	          deferred.resolve(result);
	        }, function(reason) {
	        	//TODO FIXME 
	          console.log(reason);
	          deferred.reject(reason);
	        });
		     
	      return deferred.promise;
  	};


  /**
   * get consultation list from local db
   */
  var getConsultationLocalList=function(db){ 
     var deferred = $q.defer();
     var query="select * from consultation";
     $cordovaSQLite.execute(db,query).then(function(result){

        
      deferred.resolve(result);
    },function(reason){
        console.log("error: " +reason);
        deferred.reject(reason);
   })
   return deferred.promise;

  }

	/**
	 * update consultation
	 */ 
	var updateConsultation=function(db,cons){
		  	//	console.log("to update"+rdv.doctor)
      var deferred = $q.defer();
	  		var  query="update consultation set idDoc='"+cons.idDoc+"', "+
  					"doctor='"+cons.doctor+"', "+
  					"specialite='"+cons.specialite+"', "+
  					"date='"+cons.date +"', "+
  					"maladie='"+cons.maladie+"',"+
  					"medicament='"+cons.medicament+"',"+
  					"prix='"+cons.prix+"',"+
  					"description='"+cons.description+"'"+
  					"where id="+cons.id+"";
            //console.warn(query);
	  		$cordovaSQLite.execute(db, query).then(function(result){
	  			//console.log("update consultation ")
          		deferred.resolve(result);
	  		},function(reason){
		      	console.log("error "+reason)
	  			deferred.reject(reason)
	  		});
        return deferred.promise;
	}

  	/**
  	* create or update consultation
  	*/
  	var createOrUpdateConsultation=function(db,cons){
        var deferred=$q.defer();
        getConsultationById(db,cons.id).then(function(result){ //return 1 row
          if(result.rows.length==1){ 
           // console.log("found===>update "+result.rows.length)
            updateConsultation(db,cons).then(function(result){
             // console.log("consultation updateeeeee ")
              deferred.resolve(result);
            },function(reason){
              deferred.reject(reason)
            });

          }else{
          //  console.log("not found===>insert")
            setConsultation(db,cons).then(function(result){
         //   console.log("consultation ajoutéééééé")
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
     * insert an array of rdv into rdv
     */
     
    var insertBulkIntoConsultationTable = function(db, consultationArray) {
    	//id, idDoc, doctor, specialite, date,maladie,medicament,prix,description
      var deferred=$q.defer();
      var insertQuery = "INSERT INTO consultation " + 
        " SELECT '" + consultationArray[0].id  + "' AS 'id', '" +
          consultationArray[0].idDoc  + "' AS 'idDoc','" + 
          consultationArray[0].doctor  + "' AS 'doctor','" + 
          consultationArray[0].specialite + "' AS 'specialite','" + 
          consultationArray[0].maladie + "' AS 'maladie','"+
          consultationArray[0].medicament + "' AS 'medicament', '" + 
          consultationArray[0].prix + "' AS 'prix', '" + 
          consultationArray[0].description+"' AS 'description' ";

      for (var i =1; i < consultationArray.length; i++) {

        insertQuery = insertQuery + "  UNION SELECT '"
            + consultationArray[i].id + "','"
            + consultationArray[i].idDoc + "', '"
            + consultationArray[i].doctor + "', '"
            + consultationArray[i].specialite + "','"
            + consultationArray[i].maladie + "', '"
            + consultationArray[i].prix + "', '"
            +consultationArray[i].description +"'";
      }

  

        $cordovaSQLite.execute(db, insertQuery).then(function(result) {
            
                deferred.resolve(result);

            }, function(reason) {
               deferred.reject(reason);
            });
         return deferred.promise;
      }


    var consultationAppelRecur=function (db,counter, rdvList, callBack) {
        var length = rdvList.length;

        if (counter < length) {
          console.log(rdvList)
            createOrUpdateConsultation(db, rdvList[counter]).then(function(result) {
                counter++;
                consultationAppelRecur(db,counter, rdvList, callBack);
            }, function(reason) {
                return callBack(false)
            });

        } else {
            return callBack(true)
        }

    }

    /**
     * delete all records from user table
     */
    var emptyConsultationTable = function(db) {

        var deferred = $q.defer();
        var query = "DROP Table IF EXISTS consultation ";
        $cordovaSQLite.execute(db, query).then(function(result) {

            deferred.resolve(result);
        }, function(reason) {
            deferred.reject(reason);
        });
        return deferred.promise;

    };


	/**
	 *return
	 */
	return{
		getConsultationList : getConsultationList,
		createConsultationTable : createConsultationTable,
		setConsultation : setConsultation,
		getConsultationById : getConsultationById,
		getConsultationLocalList :getConsultationLocalList,
		updateConsultation : updateConsultation,
		createOrUpdateConsultation : createOrUpdateConsultation,
		insertBulkIntoConsultationTable : insertBulkIntoConsultationTable,
		consultationAppelRecur : consultationAppelRecur,
    emptyConsultationTable : emptyConsultationTable
	}
})