var soap = require('soap');
var url = 'http://localhost:8081/wsdl?wsdl';
const axios = require('axios');

var params = {

  idHotel: "0",
  name: "Augusto",
  surname: "Lucas",
  rentalDate: "15_03_2022",
  numberOfNights: "2",
  numberOfRooms: "1"

};

var args = {

  idReservation: 2

};

var soapHeader = {
  
  token: "titi"

};

//axios.post("http://localhost:8082/bookings",params);

soap.createClient(url,function(err,client) {
    client.addSoapHeader(soapHeader);
    client.reserverHotel(params,function(err,result) {
        console.log(result);
        console.log(client.describe());
      });
});