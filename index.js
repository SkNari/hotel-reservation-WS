const express = require('express');
const soap = require('soap');
const bodyParser = require('body-parser')

var hotelReservationService = {
    service: {
      port: {
        getHotels: function(args) {
          console.log("toto");  
          return {
            hotels: {}
          };
        },
        reserverHotel: function(args) {
            return {
                reservation: "Yes "+args.idHotel
            };
        },
        cancelReservation : function(args) {

            return{
                cancellation: "Yes "+args.idHotel
            };

        }
      }
    }
  };
  

var xml = require('fs').readFileSync('myservice.wsdl', 'utf8');

//express server example
var app = express();
//body parser middleware are supported (optional)
app.use(bodyParser.raw({type: function(){return true;}, limit: '5mb'}));
app.listen(8000, function(){
    //Note: /wsdl route will be handled by soap module
    //and all other routes & middleware will continue to work
    soap.listen(app, '/wsdl', hotelReservationService, xml, function(){
      console.log('server initialized');
    });
});