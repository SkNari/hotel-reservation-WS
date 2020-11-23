const express = require('express');
const soap = require('soap');
const bodyParser = require('body-parser');
const config = require("./config.json");
const axios = require('axios');

var url = "http://"+config.host+":"+config.port;

console.log(url);

var hotelReservationService = {
    service: {
      port: {
        getHotels: function(args,callback) {

          var params = {
            start_date: args.rentalDate,
            nights: args.numberOfNights,
            rooms: args.numberOfRooms
          }

          axios.get(url+"/ask_booking",{params:params}).then(resp=> {

            if(resp.status==200){
              callback(resp.data.data);
            }else{
              callback({
                code: resp.status,
                message: resp.data.message
              })
            }

          })
          .catch( (error) => {

            console.log(error);
            callback({
              status:error.response.status,
              message: error.response.data.message
            })

          })

        },
        reserverHotel: function(args) {
            return {
                reservation: "Yes "+args.idHotel
            };
        },
        cancelReservation : function(args,callback) {

          axios.delete(url+"/booking/"+args.idReservation).then(resp=>{

            callback({cancellation:"true"});

          }).catch(error => {

            console.log(error);
            callback({cancellation:"false"});

          })

        }
      }
    }
  };
  

var xml = require('fs').readFileSync('myservice.wsdl', 'utf8');

//express server example
var app = express();
//body parser middleware are supported (optional)
app.use(bodyParser.raw({type: function(){return true;}, limit: '5mb'}));
app.listen(8081, function(){
    //Note: /wsdl route will be handled by soap module
    //and all other routes & middleware will continue to work
    soap.listen(app, '/wsdl', hotelReservationService, xml, function(){
      console.log('server initialized');
    });
});