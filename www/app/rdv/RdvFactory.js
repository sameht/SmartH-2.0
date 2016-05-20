appContext.factory('RdvFactory', function($http, $cordovaSQLite, $q){
  var getData=function(){
     var array =[{id : 110,idDoc:1, doctor: "GAALOUL HECHMI",date :"Novembre 01 2016",heure:"11:30",adresse :"SOUSSE MEDINA, AV. LEOPOLD SEDAR SENGHOR",etat:"true"},
          {id : 112,idDoc:2, doctor: " DEBBICHE NOUREDDINE",date :"Juin 02 2016",heure: "12:30",adresse :"1 BIS, RUE MOUSSA IBN NOUCAIR",etat:"true"},
          {id : 115,idDoc:1,doctor: "Marty one",date :"Novembre 02 2012",heure: "12:30",adresse :"2000 MONASTIR Av.Habib BOURGUIBA",etat:"false"},
          {id : 116,idDoc:1,doctor: "Marty one",date :"Novembre 02 2012",heure: "12:30",adresse :"2000 MONASTIR Av.Habib BOURGUIBA",etat:"true"}
        
    ] 
    return array;
  }
  /**
   * get rdv list from server
   */
	var getRdvList=function(id){

    var deferred = $q.defer();
		var request = {
			url : "http://smarth.azurewebsites.net/smarth/rdv-list.php",
			method :"POST",
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
        IdPatient :12
      }
		}; 

		return $http(request)
    /*setTimeout(function() {
      deferred.resolve(getData());
    }, 1500);

		return deferred.promise*/
	};

  /**
   *  remove rdv
   */
  var deleteRdvServer = function(id,callBack,errorCallBack){
    
    // the send request parameters
    var request = {
            method: 'POST',
            url: 'http://buzcard.fr/contacts.aspx?request=update',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            transformRequest: function(obj) {
              var str = [];
              for ( var p in obj)
                str.push(encodeURIComponent(p) + "="
                        + encodeURIComponent(obj[p]));
              return str.join("&");
            },
            transformResponse: function(data) {
              var x2js = new X2JS();
              var json = x2js.xml_str2json(data);
              return json;
            },
            data: {
              rdv_id:id,
              field : "status",
              value : "deleted"
            },
//            timeout : 5000,
    };
    
    $http(request).success(function(data, status, headers, config) {
        callBack(data);
    }).error(function(data, status, headers, config) {
      errorCallBack(status);
    });
  };


  /**
   *   update rdv server
   */
  var updateRdvServer = function(id,date, heure,callBack,errorCallBack){

   // the send request parameters
    var request = {
      method: 'POST',
      url: 'http://buzcard.fr/contacts.aspx?request=update',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      transformRequest: function(obj) {
        var str = [];
        for ( var p in obj)
          str.push(encodeURIComponent(p) + "="
                  + encodeURIComponent(obj[p]));
        return str.join("&");
      },
      transformResponse: function(data) {
        var x2js = new X2JS();
        var json = x2js.xml_str2json(data);
        return json;
      },
      data: {
        id:id,
        date : date,
        heure : heure
      },
//      timeout : 5000,
    };
    
    $http(request).success(function(data, status, headers, config) {
    
        callBack(data);
      
    }).error(function(data, status, headers, config) {
      errorCallBack(status);
    });
  };



	/**
     * create Rdv table
     */
    var createRdvTable = function(db) {
      var deferred= $q.defer();
      var CreateQuery = 'CREATE TABLE IF NOT EXISTS rdv (' +
            'id INTEGER PRIMARY KEY, ' +
            'idDoc INTEGER,doctor text, date text, adresse text, etat text)';
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
     * save the rdv into the rdv Table
     */
    var setRdv = function(db,rdv) {
       var deferred= $q.defer();

      var query=" INSERT INTO rdv (id, idDoc, doctor, date,adresse,etat) VALUES (?,?,?,?,?,?) "
      $cordovaSQLite.execute(db, query, [rdv.id, rdv.idDoc, rdv.doctor, rdv.date,rdv.adresse,rdv.etat]).then(function(result) {
         deferred.resolve(result)

      }, function(reason) {
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
	          console.log("error " + JSON.stringify(reason));
	          deferred.reject(reason);
	        });
		     
	      return deferred.promise;
  	};


 /**
   * get rdv list from local db
   */
  var getRdvLocalList=function(db){ 
     var deferred = $q.defer();
     var query="SELECT * FROM rdv WHERE etat ='En cours' ";
     $cordovaSQLite.execute(db,query).then(function(result){

        
      deferred.resolve(result);
    },function(reason){
        console.log("error " + JSON.stringify(reason));
         
        deferred.reject(reason);
   })
   return deferred.promise;

  }

 /**
	* update rdv 
	*/
  	var updateRdv = function (db,rdv){
  	//	console.log("to update"+rdv.doctor)
      var deferred = $q.defer();
	  		var  query="update rdv set idDoc='"+rdv.idDoc+"', "+
            "doctor='"+rdv.doctor+"', "+
  					"date='"+rdv.date+"', "+
            "adresse='"+rdv.adresse+"', "+
  					"etat='"+rdv.etat+"'"+
  					"where id="+rdv.id+"";
           // console.warn(query);
	  		$cordovaSQLite.execute(db, query).then(function(result){
          deferred.resolve(result);
	  		},function(reason){
	  			deferred.reject(reason)
	  		});
        return deferred.promise;
  	};

  	/**
  	* create or update rdv
  	*/
  	var createOrUpdateRdv=function(db,rdv){
        var deferred=$q.defer();
        getRdvById(db,rdv.id).then(function(result){ //return 1 row
          if(result.rows.length==1){ 
           // console.log("found===>update "+result.rows.length)
            updateRdv(db,rdv).then(function(result){
              //console.log("rdv updateeeeee ")
              deferred.resolve(result);
            },function(reason){
              deferred.reject(reason)
            });

          }else{
          //  console.log("not found===>insert")
            setRdv(db,rdv).then(function(result){
            //console.log("rdv ajoutéééééé")
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
     *  remove contact
     */
    var deleteRdv=function(db,id){
        var deferred=$q.defer();
        var query = "delete from rdv where id="+id;
        $cordovaSQLite.execute(db, query).then(function(result){
          deferred.resolve(result);
        },function(reason){
          console.log("error: "+reason)
          deferred.reject(reason)
        });
        return deferred.promise;
     }
     
    /**
     * insert an array of rdv into rdv
     */
    var insertBulkIntoRdvTable = function(db, rdvArray) {

      var deferred=$q.defer();
      var insertQuery = "INSERT INTO rdv " + 
        " SELECT '" + rdvArray[0].id  + "' AS 'id', '" +
          rdvArray[0].idDoc  + "' AS 'idDoc','" + 
          rdvArray[0].doctor  + "' AS 'doctor','" + 
          rdvArray[0].date + "' AS 'date','" + 
          rdvArray[0].adresse + "' AS 'adresse', '" + 
          rdvArray[0].etat+"' AS 'etat' ";

      for (var i =1; i < rdvArray.length; i++) {

        insertQuery = insertQuery + "  UNION SELECT '"
            + rdvArray[i].id + "','"
            + rdvArray[i].idDoc + "', '"
            + rdvArray[i].doctor + "', '"
            + rdvArray[i].date + "','"
            + rdvArray[i].adresse + "', '"
            +rdvArray[i].etat +"'";
      }

  

        $cordovaSQLite.execute(db, insertQuery).then(function(result) {
            
                deferred.resolve(result);

            }, function(reason) {
               deferred.reject(reason);
            });
         return deferred.promise;
      }
  	
    var rdvAppelRecur=function (db,counter, rdvList, callBack) {
        var length = rdvList.length;

        if (counter < length) {

            createOrUpdateRdv(db, rdvList[counter]).then(function(result) {
                counter++;
                rdvAppelRecur(db,counter, rdvList, callBack);
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
    var emptyRdvTable = function(db) {

        var deferred = $q.defer();
        var query = "DROP Table IF EXISTS Rdv ";
        $cordovaSQLite.execute(db, query).then(function(result) {

            deferred.resolve(result);
        }, function(reason) {
            deferred.reject(reason);
        });
        return deferred.promise;

    };

	return{
		getRdvList : getRdvList,
    deleteRdvServer : deleteRdvServer,
    getRdvLocalList : getRdvLocalList,
		createRdvTable: createRdvTable,
		setRdv : setRdv,
		getRdvById : getRdvById,
		updateRdv : updateRdv,
		createOrUpdateRdv : createOrUpdateRdv,
    deleteRdv : deleteRdv,
    insertBulkIntoRdvTable : insertBulkIntoRdvTable,
    rdvAppelRecur : rdvAppelRecur,
    emptyRdvTable : emptyRdvTable
	}
})