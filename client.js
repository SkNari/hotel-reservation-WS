var soap = require('soap');
var url = 'http://localhost:8081/wsdl?wsdl';
var args = {toto: "toto"};
const axios = require('axios');

var params = {

  identifier : "toto",
  name : "toto",
  surname : "toto",
  start_date : "24_11_2020",
  nights : 5,
  hotel_identifier : "titi"

}

var soapHeader = {

  token : "toto"

};

//axios.post("http://localhost:8082/bookings",params);

soap.createClient(url,function(err,client) {
    client.addSoapHeader(soapHeader);
    client.reserverHotel(args,function(err,result) {
        console.log(result);
        console.log(client.describe());
      });
});