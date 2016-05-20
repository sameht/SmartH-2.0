appContext.factory('DoctorLocatorFactory', function($http, $ionicPlatform, $q, $cordovaSQLite) {
    var getData = function() {
        var array = [{
                id: 10,
                doctor: "Marty MONASTIR",
                specialite: "généraliste",
                sexe: "homme",
                adresse: "1000 MONASTIR Av.Habib BOURGUIBA",
                tel: "71 75 001",
                distance: "undefined"
            }, {
                id: 11,
                doctor: "Marty Tunis",
                specialite: "généraliste",
                sexe: "homme",
                adresse: "Bab Bhar, Gouvernorat de Tunis, Tunisie",
                tel: "71 75 001",
                distance: "undefined"
            }, {
                id: 12,
                doctor: "Marty Téboulba",
                specialite: "généraliste",
                sexe: "homme",
                adresse: "Téboulba, Monastir, Tunisie",
                tel: "71 75 001",
                distance: "undefined"
            }, {
                id: 13,
                doctor: "Marty Moknine",
                specialite: "généraliste",
                sexe: "homme",
                adresse: "Moknine, Monastir, Tunisie",
                tel: "71 75 001",
                distance: "undefined"
            }] //+ spécialité de médecin

        return array
    }
    
    var db = null;
    $ionicPlatform.ready(function() {

        if (window.cordova) {
            db = window.sqlitePlugin.openDatabase({
                name: "smartH",
                androidDatabaseImplementation: 2,
                location: 1
            }); // device
        } else {
            db = window.openDatabase("smartH", '1', 'desc', 1024 * 1024 * 5); // browser
            console.warn("created !")
        }
    })

    /**
     * get doctor list from server
     */
    var getDoctorList = function(name, lastname, speciality, gendre) {
        var request = {
            //url: "http://smarth.azurewebsites.net/api/WSDoctorList/Get",
            url: "http://smarth.azurewebsites.net/smarth/doc-list.php",
            //method: "Get",
            method: "Post",
            cache: false,
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
            data: {
               
            }
        };

        return $http(request)
        return getData();

    };
    /**
     * create alldoctor table
     */
    var createAllDoctorsTable = function(db) {
        var deferred = $q.defer();
        var CreateQuery = 'CREATE TABLE IF NOT EXISTS allDoctors (' +
            'id INTEGER PRIMARY KEY, ' +
            'name text,lastname text, specialite text,sexe text, adresse text, tel text,distance text)';
        $cordovaSQLite.execute(db, CreateQuery).then(
            function(result) {
                deferred.resolve(result);
            },
            function(reason) {
                console.log("error : " + reason)
                deferred.reject(reason);
            });
        return deferred.promise;
    }

    /**
     * insert an array of doctors into doctor
     */
    var insertBulkIntoAllDoctorsTable = function(db, doctorArray) {

        var deferred = $q.defer();
        var insertQuery = "INSERT INTO allDoctors " +
            " SELECT '" + doctorArray[0].id + "' AS 'id', '" +
            doctorArray[0].name + "' AS 'name','" +
            doctorArray[0].lastname + "' AS 'lastname','" +
            doctorArray[0].specialite + "' AS 'specialite','" +
            doctorArray[0].sexe + "' AS 'sexe','" +
            doctorArray[0].adresse + "' AS 'adresse', '" +
            doctorArray[0].tel + "' AS 'tel','" +
            doctorArray[0].distance + "' AS 'distance' ";

        for (var i = 1; i < doctorArray.length; i++) {

            insertQuery = insertQuery + "  UNION SELECT '" +
                doctorArray[i].id + "','" +
                doctorArray[i].name + "', '" +
                doctorArray[i].lastname + "', '" +
                doctorArray[i].specialite + "','" +
                doctorArray[i].sexe + "', '" +
                doctorArray[i].adresse + "', '" +
                doctorArray[i].tel + "', '" +
                doctorArray[i].distance + "'";
        }



        $cordovaSQLite.execute(db, insertQuery).then(function(result) {

            deferred.resolve(result);

        }, function(reason) {
            deferred.reject(reason);
        });
        return deferred.promise;
    }

    /**
     * get doctor list from local db
     */
    var getAllDoctorsLocalList = function(db) {
        var deferred = $q.defer();
        var query = "select * from allDoctors ";
        console.warn(query);
        $cordovaSQLite.execute(db, query).then(function(result) {

            deferred.resolve(result);
        }, function(reason) {
            console.log("error: " + reason);
            deferred.reject(reason);
        })
        return deferred.promise;

    }

    /**
     * create doctor table
     */
    var createDoctorTable = function(db) {
            var deferred = $q.defer();
            var CreateQuery = 'CREATE TABLE IF NOT EXISTS doctor (' +
                'id INTEGER PRIMARY KEY, ' +
                'name text,lastname text, specialite text,sexe text, adresse text, tel text,distance text)';
            $cordovaSQLite.execute(db, CreateQuery).then(
                function(result) {
                    deferred.resolve(result);
                },
                function(reason) {
                    console.log("error : " + reason)
                    deferred.reject(reason);
                });
            return deferred.promise;
        }
        /**
         * save the doctor into the doctor Table
         */
    var setDoctor = function(db, doc) {
        var deferred = $q.defer();

        var query = " INSERT INTO doctor (id, name, lastname, specialite,sexe,adresse,tel,distance) VALUES (?,?,?,?,?,?,?,?) "
        $cordovaSQLite.execute(db, query, [doc.id, doc.name, doc.lastname,doc.specialite, doc.sexe, doc.adresse, doc.tel, doc.distance]).then(function(result) {
            deferred.resolve(result)

        }, function(reason) {
            console.log("error : " + reason)
            deferred.reject(reason)
        });

        return deferred.promise;
    }

    /**
     * select doctor details by id from local db
     */
    var getDoctorById = function(db, id) {

        var deferred = $q.defer();
        var query = 'SELECT * FROM doctor where id=' + id;
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
    var getDoctorLocalList = function(db) {
        var deferred = $q.defer();
        var query = "select * from doctor ";
        console.warn(query);
        $cordovaSQLite.execute(db, query).then(function(result) {

            deferred.resolve(result);
        }, function(reason) {
            console.log("error: " + reason);
            deferred.reject(reason);
        })
        return deferred.promise;

    }

    /**
     * update rdv 
     */
    var updateDoctor = function(db, doc) {
        var deferred = $q.defer();
        var query = "update doctor set name='" + doc.name + "', " +
            "lastname='" + doc.lastname + "', " +
            "specialite='" + doc.specialite + "', " +
            "sexe='" + doc.sexe + "', " +
            "adresse='" + doc.adresse + "', " +
            "tel='" + doc.tel + "', " +
            "distance='" + doc.distance + "'" +
            "where id=" + doc.id + "";
        // console.warn(query);
        $cordovaSQLite.execute(db, query).then(function(result) {
            deferred.resolve(result);
        }, function(reason) {
            console.log("error: " + reason);
            deferred.reject(reason)
        });
        return deferred.promise;
    };

    /**
     * create or update doctor
     */
    var createOrUpdateDoctor = function(db, doc) {
        var deferred = $q.defer();
        getDoctorById(db, doc.id).then(function(result) { //return 1 row
            if (result.rows.length == 1) {
                // console.log("found===>update "+result.rows.length)
                updateDoctor(db, doc).then(function(result) {
                    //console.log("doc updateeeeee ")
                    deferred.resolve(result);
                }, function(reason) {
                    deferred.reject(reason)
                });

            } else {
                //  console.log("not found===>insert")
                setDoctor(db, doc).then(function(result) {
                    //console.log("doc ajoutéééééé")
                    deferred.resolve(result);
                }, function(reason) {
                    deferred.reject(reason)
                });
            }
        }, function(reason) {
            deferred.reject(reason)

        });
        return deferred.promise;
    }


    /**
     * delete all records from doctor table
     */
    var emptyDoctorTable = function(db) {

        var deferred = $q.defer();
        var query = "DROP Table IF EXISTS doctor ";
        $cordovaSQLite.execute(db, query).then(function(result) {

            deferred.resolve(result);
        }, function(reason) {
            deferred.reject(reason);
        });
        return deferred.promise;

    };

    /**
     * delete all records from doctor table
     */
    var emptyAllDoctorTable = function(db) {

        var deferred = $q.defer();
        var query = "DROP Table IF EXISTS allDoctors ";
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
    var insertBulkIntoDoctorTable = function(db, doctorArray) {

var deferred = $q.defer();
        var insertQuery = "INSERT INTO doctor " +
            " SELECT '" + doctorArray[0].id + "' AS 'id', '" +
            doctorArray[0].name + "' AS 'name','" +
            doctorArray[0].lastname + "' AS 'lastname','" +
            doctorArray[0].specialite + "' AS 'specialite','" +
            doctorArray[0].sexe + "' AS 'sexe','" +
            doctorArray[0].adresse + "' AS 'adresse', '" +
            doctorArray[0].tel + "' AS 'tel','" +
            doctorArray[0].distance + "' AS 'distance' ";

        for (var i = 1; i < doctorArray.length; i++) {

            insertQuery = insertQuery + "  UNION SELECT '" +
                doctorArray[i].id + "','" +
                doctorArray[i].name + "', '" +
                doctorArray[i].lastname + "', '" +
                doctorArray[i].specialite + "','" +
                doctorArray[i].sexe + "', '" +
                doctorArray[i].adresse + "', '" +
                doctorArray[i].tel + "', '" +
                doctorArray[i].distance + "'";
        }



        $cordovaSQLite.execute(db, insertQuery).then(function(result) {

            deferred.resolve(result);

        }, function(reason) {
            deferred.reject(reason);
        });
        return deferred.promise;
    }

    /**
     *Calculate distance and return doctor
     */
    var calculateDistance = function(origin, doctor) {
        console.log("3.3) ==> calculer la distance")
        var deferred = $q.defer();
        var service = new google.maps.DistanceMatrixService;
        service.getDistanceMatrix({
            origins: [origin],
            destinations: [doctor.adresse],
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.METRIC, // distance
            avoidHighways: false,
            avoidTolls: false
                // resultat du calcule
        }, function(response, status) {
            if (status == google.maps.DistanceMatrixStatus.INVALID_REQUEST) {
                alert('Error was: ' + status);
                deferred.reject(reason);
            } else
            if (status !== google.maps.DistanceMatrixStatus.OK) {
                alert('Error was: ' + status);
                deferred.reject(reason)
            } else {
                var originList = response.originAddresses;
                var destinationList = response.destinationAddresses;
                var results = response.rows[0].elements;
                var distance = results[0].distance.value;
                doctor.distance = distance;
                console.log("calculé " + distance)
                deferred.resolve(doctor);
            }
        })
        return deferred.promise;
    }

    /**
     * filrer le résultat par distance
     */    
    var FiltrerDistance = function(doc, dist, currentPosition, callBack) {
        console.log("2.2) ==> filtrer la distance")
        console.log("3) ==> calculer la distance")
        calculateDistance(currentPosition, doc).then(function(result) {
            console.log(result.distance)
            if (dist >= result.distance) {
                console.log(" true")
                return callBack(result)
            } else {
                console.log(" false")
                return callBack(null)
            }

        }, function(error) {
            console.log("erreuuuuuuuuuuur")
            return callBack(null)
        })
    }

    /**
     * Appel récursive de calcule de distance
     */
    var distanceAppelRecur = function(db, counter, docList, dist, currentPosition, callBack) {

            var length = docList.length;
            //console.log(length)

            if (counter < length) {
                FiltrerDistance(docList[counter], dist, currentPosition, function(valid) {
                    console.log(valid)
                    if (valid != null) {
                        //console.log( docList[counter])
                        setDoctor(db, docList[counter]).then(function(result) {
                            counter++;
                            distanceAppelRecur(db, counter, docList, dist, currentPosition, callBack);
                        }, function(reason) {

                            return callBack(false)
                        });
                    } else {

                        counter++;
                        distanceAppelRecur(db, counter, docList, dist, currentPosition, callBack);
                        console.log("resultat null")
                    }
                })


            } else {
                return callBack(true)
            }
        }
      /**
       * Filtrer par région ou ville
       */
    var FiltrerVilleRegion = function(doc, region, ville, callBack) {
        //filter avec ville et région
        var geocoder = new google.maps.Geocoder;
        var adresse = doc.adresse
        geocoder.geocode({
            'address': adresse
        }, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                //resultsMap.setCenter(results[0].geometry.location);
                var resultat = results[0].address_components
                var locality = "";
                var Gouvernorat = ""
                var route = ""
                    //les composants de l'adresse :
                for (var i = 0; i < resultat.length; i++) {
                    if (resultat[i].types[0] == "locality") {
                        locality = resultat[i].long_name // ville
                        console.log("ville: " + locality)

                    }
                    if (resultat[i].types[0] == "administrative_area_level_1") {
                        Gouvernorat = resultat[i].long_name // région
                        console.log("région : " + Gouvernorat)

                    }
                    if (resultat[i].types[0] == "route") {
                        route = resultat[i].long_name // route
                        console.log("route :" + route)
                    }
                };
                /*comparaison */
               
                if (region.toLowerCase().indexOf(Gouvernorat.toLowerCase())> -1  || ville.toLowerCase().indexOf(locality.toLowerCase())> -1 ) {
                    console.log("il ya de resultat")
                    return callBack(doc);

                } else {
                    console.log("pas resultat")
                    return callBack(null)
                }

            } else {
                alert('Geocode was not successful for the following reason: ' + status);
                return callBack(null)
            }
        });
    }
    var regionAppelRecur = function(db, counter, docList, region, ville, callBack) {
            var length = docList.length;
            //console.log(length)
            if (counter < length) {
                FiltrerVilleRegion(docList[counter], region, ville, function(valid) {
                    console.log(valid)
                    if (valid != null) {
                        setDoctor(db, docList[counter]).then(function(result) {
                            counter++;
                            regionAppelRecur(db, counter, docList, region, ville, callBack);
                        }, function(reason) {

                            console.log("erreuuuuuuuuuuur setDoctor")
                            return callBack(false)
                        });
                    } else {

                        counter++;
                        regionAppelRecur(db, counter, docList, region, ville, callBack);
                        console.log("resultat null")
                    }
                })


            } else {
                return callBack(true)
            }
    }
        /**
         * get doctor list By distance
         */
    var getDoctorListByDistance = function(dist, region, ville, currentPosition,callBack) {
        var resultArray = [];
        var array = getData();
        getAllDoctorsLocalList(db).then(function(data) {
                for (var i = 0; i < data.rows.length; i++) {
                    resultArray.push(data.rows.item(i))
                };
                console.log(resultArray)
                
                    //array=data.rows
                if(!isNaN(dist)){ // par distance
                    distanceAppelRecur(db, 0, resultArray, dist, currentPosition, function(valid) {

                      if (!valid) {
                          console.error("valid " + valid)

                      } else {

                            return callBack()

                      }

                  });
                }else{ //par ville etc 
                  regionAppelRecur(db, 0, resultArray, region, ville, function(valid) {

                      if (!valid) {
                          console.error("valid " + valid)

                      } else {
                          return callBack()

                      }

                  });
                }

            },
            function() {

            })

    };

    /**
     * GET the user credentials into the USER Table
     */
    var ifTableExist = function(db) {
        var deferred=$q.defer();
        $cordovaSQLite.execute(db, "SELECT name FROM sqlite_master WHERE type='table' AND name='allDoctors';").then(function(results) {
            if (results.rows.length > 0) {
                
        
                     deferred.resolve(true);
   
            } else {
                console.log('table nexiste pas');
                deferred.resolve(false);
            }
        }, function(reason) {
            deferred.reject(reason);
        });
        return deferred.promise;
    };

      /**
       * Filtrer par région ou ville
       */
    var FiltrerNom = function(doc,nom, prenom, specialite, sexe, callBack) {
          //filter avec doctor, specialite,sexe,
        if( doc.doctor != undefined && doc.doctor.toLowerCase().indexOf(nom.toLowerCase())> -1 ){
  
            return callBack(doc); 
        }else if(doc.doctor != undefined && doc.doctor.toLowerCase().indexOf(prenom.toLowerCase())> -1){
            return callBack(doc);
        }else if(doc.specialite != undefined && doc.specialite==specialite){
            return callBack(doc);
        }else if(doc.sexe != undefined && doc.sexe.toLowerCase()==sexe.toLowerCase()){
            return callBack(doc);
        }
        else{
            return callBack(null);
        }
    }



    /**
     * Appel récursive de calcule de distance
     */
    var nameAppelRecur = function(db, counter, docList, nom, prenom, specialite, sexe, callBack) {

            var length = docList.length;
            //console.log(length)

            if (counter < length) {
                FiltrerNom(docList[counter],nom, prenom, specialite, sexe, function(valid) {
                    console.log(valid)
                    if (valid != null) {
                        //console.log( docList[counter])
                        setDoctor(db, docList[counter]).then(function(result) {
                            counter++;
                            nameAppelRecur(db, counter, docList, nom, prenom, specialite, sexe, callBack);
                        }, function(reason) {

                            return callBack(false)
                        });
                    } else {

                        counter++;
                         nameAppelRecur(db, counter, docList, nom, prenom, specialite, sexe, callBack);
                        console.log("resultat null")
                    }
                })


            } else {
                return callBack(true)
            }
        }
     /**
      * get doctor list By distance
      */
    var getDoctorListByName = function(nom, prenom, specialite, sexe,callBack) {
 
        var resultArray = [];
        var array = getData();
        getAllDoctorsLocalList(db).then(function(data) {
                for (var i = 0; i < data.rows.length; i++) {
                    resultArray.push(data.rows.item(i))
                };
                console.log(resultArray)
                 
                    nameAppelRecur(db, 0, resultArray, nom, prenom, specialite, sexe, function(valid) {

                      if (!valid) {
                          console.error("valid " + valid)

                      } else {

                            return callBack()

                      }

                  });
                
            },function() {

            })

    };

    var findDoctorDB = function(db, doctor, callBack){

        console.warn(doctor)
        var deferred=$q.defer();
        var  query ="SELECT * FROM allDoctors WHERE  ";

         query  = query + Object.keys(doctor)[0]+ "  LIKE '%"+doctor[ Object.keys(doctor)[0]]+"%'  ";

        for (var i = 1; i <Object.keys(doctor).length; i++) {
            query = query + " AND "+Object.keys(doctor)[i] + " LIKE '% "+doctor[ Object.keys(doctor)[i]]+" %'"
        };
  
        console.log(query)
        $cordovaSQLite.execute(db, query).then(function(results) {
             return callBack(results)
        }, function(reason) {
            console.error(reason)
            deferred.reject(reason);
        });
        return deferred.promise;
    }
    return {
        getDoctorList: getDoctorList,
        getDoctorListByDistance: getDoctorListByDistance,
        setDoctor: setDoctor,

        createAllDoctorsTable: createAllDoctorsTable,
        insertBulkIntoAllDoctorsTable: insertBulkIntoAllDoctorsTable,
        getAllDoctorsLocalList: getAllDoctorsLocalList,

        createDoctorTable: createDoctorTable,
        getDoctorById: getDoctorById,
        getDoctorLocalList: getDoctorLocalList,
        updateDoctor: updateDoctor,
        createOrUpdateDoctor: createOrUpdateDoctor,
        calculateDistance: calculateDistance,
        emptyDoctorTable: emptyDoctorTable,
        insertBulkIntoDoctorTable: insertBulkIntoDoctorTable,
        emptyAllDoctorTable : emptyAllDoctorTable,
            //  getCurrentPosition : getCurrentPosition
            ifTableExist : ifTableExist,
        getDoctorListByName : getDoctorListByName,
        findDoctorDB : findDoctorDB

    }
})