var soap = require('soap');
var url = 'http://localhost:8000/wsdl?wsdl';
var args = {rentalDate: "05-09-2020",numberOfNights:1,numberOfRoom:1};


soap.createClient(url,function(err,client) {
    client.getHotels(args,function(err,result) {
        console.log(result);
        console.log(client.describe());
      });
});