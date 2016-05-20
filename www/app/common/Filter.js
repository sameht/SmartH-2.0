appContext.filter("customDate", function() {

    //Defining the filter function
     return function(input) {

             var result = "";
             input = input || "";

             try {

 	    		    var array1 = input.split("-"); //array1[0] : annéé //array1[1] : mois
 		          var array2 = array1[2].split(" "); //array2[0] jour
   		        var array3 = array2[1].split(":");
   		        if (array1[1].length == 1 )
   		        	array1[1] = "0"+array1[1];
   		        if (array1[0].length == 1 )
   		        	array1[0] = "0"+array1[0];
   		        if (array3[0].length == 1 )
   		        	array3[0] = "0"+array3[0];
   		        if(array2[2] =="PM" && array3[0] != "12" )
   		        	array3[0] = parseInt(parseInt(array3[0]) + 12);
   		        result = array2[0] +"/"+ array1[1] +"/"+array1[0]+" à "+array3[0]+":"+array3[1];
   		        return  result;

 			} catch (e) {
// 				console.error(e);
 				return input;
 			}
     };
}).filter("onlyHours", function(){
  //Defining the filter function
   return function(input) {

           var result = "";
           input = input || "";

           try {

            var array1 = input.split("à"); //array1[0] : annéé //array1[1] : mois

            result = array1[1]
            return  result;

    } catch (e) {
// 				console.error(e);
      return input;
    }
   };
})
.filter("onlyDate", function(){
  //Defining the filter function
   return function(input) {

           var result = "";
           input = input || "";

           try {

            var array1 = input.split("à"); //array1[0] : annéé //array1[1] : mois

            result = array1[0]
            return  result;

    } catch (e) {
// 				console.error(e);
      return input;
    }
   };
})
