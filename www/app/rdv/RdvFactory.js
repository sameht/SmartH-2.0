appContext.factory('RdvFactory', function($http, $cordovaSQLite, $q){
  /**
   * get rdv list from server
   */
	var getRdvList=function(){

    var deferred = $q.defer();
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
		}; 

		//return $http(request)
    setTimeout(function() {

        var array =[{id : 110,idDoc:1, doctor: "Marty one",date :"Novembre 01 2011",heure:"11:30",adresse :"1000 MONASTIR Av.Habib BOURGUIBA",etat:"false"},
          {id : 112,idDoc:2, doctor: "Marty two",date :"Novembre 02 2012",heure: "12:30",adresse :"2000 MONASTIR Av.Habib BOURGUIBA",etat:"false"},
          {id : 115,idDoc:1,doctor: "Marty one",date :"Novembre 02 2012",heure: "12:30",adresse :"2000 MONASTIR Av.Habib BOURGUIBA",etat:"false"},
          {id : 116,idDoc:1,doctor: "Marty one",date :"Novembre 02 2012",heure: "12:30",adresse :"2000 MONASTIR Av.Habib BOURGUIBA",etat:"false"},
          {id : 117,idDoc:1,doctor: "Marty one",date :"Novembre 02 2012",heure: "12:30",adresse :"2000 MONASTIR Av.Habib BOURGUIBA",etat:"true"},
          {id : 118,idDoc:6,doctor: "Marty six",date :"Novembre 02 2012",heure: "12:30",adresse :"2000 MONASTIR Av.Habib BOURGUIBA",etat:"true"},
          {id : 119,idDoc:6,doctor: "Marty six",date :"Novembre 02 2012",heure: "12:30",adresse :"2000 MONASTIR Av.Habib BOURGUIBA",etat:"false"},
          {id : 12, idDoc:3,doctor: "Marty three",date :"Novembre 03 2013",heure: "13:30",adresse :"3000 MONASTIR Av.Habib BOURGUIBA",etat:"true"},
    ] //+ spécialité de médecin
      deferred.resolve(array);
    }, 1500);

		

		return deferred.promise
	};


	/**
     * create Rdv table
     */
    var createRdvTable = function(db) {
      var deferred= $q.defer();
      var CreateQuery = 'CREATE TABLE IF NOT EXISTS rdv (' +
            'id INTEGER PRIMARY KEY, ' +
            'idDoc INTEGER,doctor text, date text,heure text, adresse text, etat text)';
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

      var query=" INSERT INTO rdv (id, idDoc, doctor, date,heure,adresse,etat) VALUES (?,?,?,?,?,?,?) "
      $cordovaSQLite.execute(db, query, [rdv.id, rdv.idDoc, rdv.doctor, rdv.date,rdv.heure,rdv.adresse,rdv.etat]).then(function(result) {
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
     var query="SELECT * FROM rdv WHERE etat = 'true' ";
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
  					"heure='"+rdv.heure +"', "+
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
          rdvArray[0].heure + "' AS 'heure','"+
          rdvArray[0].adresse + "' AS 'adresse', '" + 
          rdvArray[0].etat+"' AS 'etat' ";

      for (var i =1; i < rdvArray.length; i++) {

        insertQuery = insertQuery + "  UNION SELECT '"
            + rdvArray[i].id + "','"
            + rdvArray[i].idDoc + "', '"
            + rdvArray[i].doctor + "', '"
            + rdvArray[i].date + "','"
            + rdvArray[i].heure + "', '"
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

	return{
		getRdvList : getRdvList,
    getRdvLocalList : getRdvLocalList,
		createRdvTable: createRdvTable,
		setRdv : setRdv,
		getRdvById : getRdvById,
		updateRdv : updateRdv,
		createOrUpdateRdv : createOrUpdateRdv,
    deleteRdv : deleteRdv,
    insertBulkIntoRdvTable : insertBulkIntoRdvTable,
    rdvAppelRecur : rdvAppelRecur
	}
})