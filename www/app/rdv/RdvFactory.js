appContext.factory('RdvFactory', function($http){
  /**
   * get rdv list
   */
	var getRDV=function(){
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
				id : id
			},
		};

		//return $http(request)
		var array =[{doctor: doctorName1,date :date1,heure heure1,adresse :adresse1},
					{doctor: doctorName2,date :date2,heure heure2,adresse :adresse2},
					{doctor: doctorName3,date :date3,heure heure3,adresse :adresse3},
		]
	}
})