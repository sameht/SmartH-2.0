appContext.factory('ConsultationFactory', function($q,$cordovaSQLite){
	/**
	 * Get consultation list from server
	 */
	 var getConsultationList=function(){
	 	var request={
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
		var array =[{id : 15, idDoc:1, doctor: "Martyy one", specialite:"généraliste",date:"November 05, 2015",maladie:"Allergies alimentaires",medicament:"INTRINSA, IXENSE",prix:"80",description:" Une consultation médicale peut être générale, gynécologique,"},
					{id : 70,idDoc:2, doctor: "Marty two", specialite:"généraliste",date:"10/10/2012",maladie:"maladie",medicament:"medi",prix:"50",description:"desc"},
					{id : 90,idDoc:3, doctor: "Marty three", specialite:"généraliste",date:"10/10/2012",maladie:"mal",medicament:"medi",prix:"50",description:"desc"},
					{id : 95,idDoc:4, doctor: "Marty four", specialite:"généraliste",date:"10/10/2012",maladie:"mal",medicament:"medi",prix:"50",description:"desc"},
					//{id : 96,idDoc:5, doctor: "Marty five", specialite:"généraliste",date:"10/10/2012",maladie:"mal",medicament:"medi",prix:"50",description:"desc"},
					{id : 91,idDoc:3, doctor: "Marty three", specialite:"généraliste",date:"10/10/2012",maladie:"mal",medicament:"medi",prix:"50",description:"desc"}
				]
		return array 
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
			console.log("error "+reason)
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
      	console.log("error "+reason)
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
	     // console.warn(query);
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
  	var createOrUpdateRdv=function(db,cons){
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
	 *return
	 */
	return{
		getConsultationList : getConsultationList,
		createConsultationTable : createConsultationTable,
		setConsultation : setConsultation,
		getConsultationById : getConsultationById,
		getConsultationLocalList :getConsultationLocalList,
		updateConsultation : updateConsultation,
		createOrUpdateRdv : createOrUpdateRdv
	}
})