const express = require('express');
const soap = require('soap');
const bodyParser = require('body-parser');
const config = require("./config.json");
const axios = require('axios');

var url = "http://"+config.host+":"+config.port;

var hotelReservationService = {
    service: {
      port: {
        getHotels: function(args,callback) {

          var exampleRequest = {

            rentalDate: "test",
            numberOfNights: "test",
            numberOfRooms: "test"

          }

          if(!compareKeys(args,exampleRequest)){

            throw {
              Fault: {
                Code: {
                  Value: "soap:Sender",
                  Subcode: { value: "rpc:BadArguments" }
                },
                Reason: { Text: "Processing Error" }
              }
            };

          }

          var params = {
            start_date: args.rentalDate,
            nights: args.numberOfNights,
            rooms: args.numberOfRooms
          }

          axios.get(url+"/hotels",{params:params}).then(resp=> {

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

            if(error.response!=undefined){
              callback({
                status:error.response.status,
                message: error.response.data.message
              })
            }else{
              callback({
                status:"404",
                message: "page not found"
              })
            }

          })

        },
        reserverHotel: function(args,callback,headers) {

          var exampleRequest = {

            idHotel: "0",
            rentalDate: "15_03_2022",
            numberOfNights: "1",
            numberOfRooms: "1"

          };

          var exampleHeader = {

            token: "toto"

          };
          
          if(!compareKeys(args,exampleRequest)||headers==null||(typeof headers != 'object')||!compareKeys(headers,exampleHeader)){

            console.log("wrong args");
            throw {
              Fault: {
                Code: {
                  Value: "soap:Sender",
                  Subcode: { value: "rpc:BadArguments" }
                },
                Reason: { Text: "Processing Error" }
              }
            };

          }
            
          var data = {

            start_date : args.rentalDate,
            nights : args.numberOfNights,
            rooms : args.numberOfRooms,
            hotel_identifier : args.idHotel

          }
          
          axios.put(url+"/bookings",data,{

            headers:{
              token: headers.token
            }

          }).then(resp=>{

            callback({add:"true"});

          }).catch(error => {

            callback({add:"false"});

          })

        },
        cancelReservation : function(args,callback,headers) {

          var exampleRequest = {

            idReservation: "0"

          };

          var exampleHeader = {

            token: "toto"

          };
          
          if(!compareKeys(args,exampleRequest)||headers==null||(typeof headers != 'object')||!compareKeys(headers,exampleHeader)){

            console.log("wrong args");
            throw {
              Fault: {
                Code: {
                  Value: "soap:Sender",
                  Subcode: { value: "rpc:BadArguments" }
                },
                Reason: { Text: "Processing Error" }
              }
            };

          }

          axios.delete(url+"/booking/"+args.idReservation,{

            headers:{
              token: headers.token
            }

          }).then(resp=>{

            callback({cancellation:"true"});

          }).catch(error => {

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



function compareKeys(a, b) {

  if(typeof a != 'object' || typeof b != 'object'){
    return false;
  }
  if(a==null&&b==null){
    return true;
  }
  if(a==null||b==null){
    return false;
  }
  var aKeys = Object.keys(a).sort();
  var bKeys = Object.keys(b).sort();
  return JSON.stringify(aKeys) === JSON.stringify(bKeys);
}