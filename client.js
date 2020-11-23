var soap = require('soap');
var url = 'http://localhost:8081/wsdl?wsdl';
var args = {idReservation: "toto"};
const axios = require('axios');

var params = {

  identifier : "toto",
  name : "toto",
  surname : "toto",
  start_date : "24_11_2020",
  nights : 5,
  hotel_identifier : "titi"

}

//axios.post("http://localhost:8082/bookings",params);

soap.createClient(url,function(err,client) {
    client.cancelReservation(args,function(err,result) {
        console.log(result);
      });
});