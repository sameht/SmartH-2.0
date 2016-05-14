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
            url: "http://smarth.azurewebsites.net/api/WSDoctorList/Get",
            method: "Get",
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
                name: name,
                lastname: lastname,
                speciality: speciality,
                gendre: gendre
            }
        };

        return $http(request)
            //return getData();

    };
    /**
     * create alldoctor table
     */
    var createAllDoctorsTable = function(db) {
        var deferred = $q.defer();
        var CreateQuery = 'CREATE TABLE IF NOT EXISTS allDoctors (' +
            'id INTEGER PRIMARY KEY, ' +
            'doctor text, specialite text,sexe text, adresse text, tel text,distance text)';
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
            doctorArray[0].doctor + "' AS 'doctor','" +
            doctorArray[0].specialite + "' AS 'specialite','" +
            doctorArray[0].sexe + "' AS 'sexe','" +
            doctorArray[0].adresse + "' AS 'adresse', '" +
            doctorArray[0].tel + "' AS 'tel','" +
            doctorArray[0].distance + "' AS 'distance' ";

        for (var i = 1; i < doctorArray.length; i++) {

            insertQuery = insertQuery + "  UNION SELECT '" +
                doctorArray[i].id + "','" +
                doctorArray[i].doctor + "', '" +
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
                'doctor text, specialite text,sexe text, adresse text, tel text,distance text)';
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

        var query = " INSERT INTO doctor (id, doctor, specialite,sexe,adresse,tel,distance) VALUES (?,?,?,?,?,?,?) "
        $cordovaSQLite.execute(db, query, [doc.id, doc.doctor, doc.specialite, doc.sexe, doc.adresse, doc.tel, doc.distance]).then(function(result) {
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
        var query = "update doctor set doctor='" + doc.doctor + "', " +
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
     * insert an array of doctors into doctor
     */
    var insertBulkIntoDoctorTable = function(db, doctorArray) {

        var deferred = $q.defer();
        var insertQuery = "INSERT INTO doctor " +
            " SELECT '" + doctorArray[0].id + "' AS 'id', '" +
            doctorArray[0].doctor + "' AS 'doctor','" +
            doctorArray[0].specialite + "' AS 'specialite','" +
            doctorArray[0].sexe + "' AS 'sexe','" +
            doctorArray[0].adresse + "' AS 'adresse', '" +
            doctorArray[0].tel + "' AS 'tel','" +
            doctorArray[0].distance + "' AS 'distance' ";

        for (var i = 1; i < doctorArray.length; i++) {

            insertQuery = insertQuery + "  UNION SELECT '" +
                doctorArray[i].id + "','" +
                doctorArray[i].doctor + "', '" +
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
     *Calculate distance and return distance
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

    var distanceAppelRecur = function(db, counter, docList, dist, currentPosition, callBack) {
            //console.log(counter)
            console.log("1.1)==>distanceAppelRecur " + counter + " " + docList)
                //console.log(docList[counter])
            var length = docList.length;
            //console.log(length)

            if (counter < length) {
                console.log("2) ==> filtrer la distance")
                FiltrerDistance(docList[counter], dist, currentPosition, function(valid) {
                    console.log(valid)
                    if (valid != null) {
                        //console.log( docList[counter])
                        setDoctor(db, docList[counter]).then(function(result) {
                            counter++;
                            distanceAppelRecur(db, counter, docList, dist, currentPosition, callBack);
                        }, function(reason) {

                            console.log("erreuuuuuuuuuuur setDoctor")
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
         * get doctor list By distance
         */
    var getDoctorListByDistance = function(dist, region, ville, currentPosition) {
        console.log(isNaN(dist))
        var resultArray = [];
        var array = getData();
        getAllDoctorsLocalList(db).then(function(data) {
                for (var i = 0; i < data.rows.length; i++) {
                    resultArray.push(data.rows[i])
                };
                console.log(resultArray)
                    //array=data.rows
                distanceAppelRecur(db, 0, resultArray, dist, currentPosition, function(valid) {


                    if (!valid) {
                        console.error("valid " + valid)

                    } else {
                        console.info("rdvAppelRecur okkkkkkkkk");

                    }

                });
            },
            function() {

            })

    };



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
        insertBulkIntoDoctorTable: insertBulkIntoDoctorTable
            //  getCurrentPosition : getCurrentPosition

    }
})