import markdown
import os
import shelve
import datetime

from flask import Flask, g
from flask_restful import Resource, Api, reqparse

from hotels_check import hotel

def get_booking_db():
    db = getattr(g, "_database2", None)
    if db is None:
        db = g._database2 = shelve.open("booking.db")
    return db

class BookingList(Resource):
    def get(self):
        shelf = get_booking_db()
        keys = list(shelf.keys())

        bookings = []
    
        for key in keys:
            bookings.append(shelf[key])

        return {'data': bookings}, 200
    
    def post(self):
        parser = reqparse.RequestParser()

        parser.add_argument('identifier', required = True)
        parser.add_argument('name', required = True)
        parser.add_argument('surname', required = True)
        parser.add_argument('start_date', required = True)
        parser.add_argument('nights', required = True)
        parser.add_argument('hotel_identifier', required = True)

        #Parse the arguments into an object
        args = parser.parse_args()

        shelf_booking = get_booking_db()
        shelf_booking[args['identifier']] = args

        return {'data' : args}, 201
    
class Booking(Resource):
    def get(self, identifier):
        shelf = get_booking_db()

        if not identifier in shelf:
            return {'messages': 'Booking not found'}, 404

        return {'data': shelf[identifier]}, 200

    def delete(self, identifier):
        shelf = get_booking_db()

        if not identifier in shelf:
            return {'messages': 'Booking not found'}, 404

        del shelf[identifier]

        return {''}, 204
    
class AskBooking(Resource):
    def delta_date(self, Date1, nights, Date2):
        nights_date = datetime.timedelta(days = int(nights))
        nul_date = datetime.timedelta(days = int(0))
        if(Date1 - Date2 > nul_date):
            if(Date1 - Date2 - nights_date >= nul_date):
                return 1
            else:
                return 0
        elif(Date1 - Date2 < nul_date):
            if(Date1 - Date2 + nights_date <= nul_date):
                return 1
            else:
                return 0
        else:
            return 0


    def get(self):
        parser = reqparse.RequestParser()

        parser.add_argument('start_date', required = True)
        parser.add_argument('nights', required = True)
        parser.add_argument('rooms', required = True)

        #Parse the arguments into an object
        args = parser.parse_args()

        actual_date = datetime.date.today()
        array_start_date = args['start_date'].split("_")
        if(int(array_start_date[0]) < 0 or int(array_start_date[0]) > 31):
            return {'messages': f'Date (day : {array_start_date[0]}) not correct '}, 204
        if(int(array_start_date[1]) < 0 or int(array_start_date[1]) > 12):
            return {'messages': f'Date (month : {array_start_date[1]}) not correct '}, 204

        start_date = datetime.date(int(array_start_date[2]), int(array_start_date[1]), int(array_start_date[0]))
        nights = int(args['nights'])
        rooms = int(args['rooms'])

        # Verify if the request is correct
        if(start_date < actual_date):
            return {'messages': 'Date not correct '}, 204
        if(nights <= 0):
            return {'messages': 'Night can\'t be nul or negative'}, 204
        if(rooms <= 0 ):
            return {'messages': 'Rooms can\'t be nul or negative'}, 204

        shelf_hotels = hotel.get_hotels_db()
        keys = list(shelf_hotels.keys())

        available_hotels = []
        for key in keys:
            if(int(shelf_hotels[key]['rooms']) >= rooms):
                available_hotels.append(shelf_hotels[key])

        shelf_booking = get_booking_db()
        keys = list(shelf_booking.keys())

        for key in keys:
            print(shelf_booking[key])
            for available_hotel in available_hotels:
                if(shelf_booking[key]['hotel_identifier'] == available_hotel["identifier"]):
                    # print("shelf_booking[key] :",shelf_booking[key]['name'])
                    array_booking_start_date = shelf_booking[key]['start_date'].split("/")
                    booking_start_date = datetime.date(int(array_booking_start_date[2]), int(array_booking_start_date[1]), int(array_booking_start_date[0]))
                    booking_nights = shelf_booking[key]['nights']
                    if(not self.delta_date(start_date,nights,booking_start_date) and not self.delta_date(booking_start_date, booking_nights, start_date)):
                        for i in range(len(available_hotels)):
                            if (available_hotels[i]['identifier'] == shelf_booking[key]["hotel_identifier"]):
                                available_hotels.pop(i)
                                break

        return {'data': available_hotels}, 200