appContext.factory('RdvFactory', function($http, $cordovaSQLite, $q){
  /**
   * get rdv list from server
   */
	var getRdvList=function(){
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
		var array =[{id : 10, doctor: "Marty one",date :"Novembre 01 2011",heure:"11:30",adresse :"1000 MONASTIR Av.Habib BOURGUIBA",etat:"true"},
          {id : 112,doctor: "Marty twwwwwo",date :"Novembre 02 2012",heure: "12:30",adresse :"2000 MONASTIR Av.Habib BOURGUIBA",etat:"false"},
          {id : 11,doctor: "Marty two",date :"Novembre 02 2012",heure: "12:30",adresse :"2000 MONASTIR Av.Habib BOURGUIBA",etat:"true"},
					{id : 12, doctor: "Marty three",date :"Novembre 03 2013",heure: "13:30",adresse :"3000 MONASTIR Av.Habib BOURGUIBA",etat:"true"},
		] //+ spécialité de médecin

		return array
	};


	/**
     * create Rdv table
     */
    var createRdvTable = function(db) {
      var deferred= $q.defer();
      var CreateQuery = 'CREATE TABLE IF NOT EXISTS rdv (' +
            'id INTEGER PRIMARY KEY, ' +
            'doctor text, date text,heure text, adresse text, etat text)';
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

      var query=" INSERT INTO rdv (id, doctor, date,heure,adresse,etat) VALUES (?,?,?,?,?,?) "
      $cordovaSQLite.execute(db, query, [rdv.id,rdv.doctor, rdv.date,rdv.heure,rdv.adresse,rdv.etat]).then(function(result) {
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
	  		var  query="update rdv set doctor='"+rdv.doctor+"', "+
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

        
  	


	return{
		getRdvList : getRdvList,
    getRdvLocalList : getRdvLocalList,
		createRdvTable: createRdvTable,
		setRdv : setRdv,
		getRdvById : getRdvById,
		updateRdv : updateRdv,
		createOrUpdateRdv : createOrUpdateRdv,
    deleteRdv : deleteRdv
	}
})