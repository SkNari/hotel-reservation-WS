import markdown
import os
import shelve

from flask import Flask, g
from flask_restful import Resource, Api, reqparse

def get_hotels_db():
    db = getattr(g, "_database", None)
    if db is None:
        db = g._database = shelve.open("hotels.db")
    return db


class HotelsList(Resource):
    def get(self):
        shelf = get_hotels_db()
        keys = list(shelf.keys())

        hotels = []

        for key in keys:
            hotels.append(shelf[key])

        return {'data': hotels}, 200
    
    def post(self):
        parser = reqparse.RequestParser()

        parser.add_argument('identifier', required = True)
        parser.add_argument('name', required = True)
        parser.add_argument('rooms', required = True)

        #Parse the arguments into an object
        args = parser.parse_args()

        shelf = get_hotels_db()
        shelf[args['identifier']] = args

        return {'data' : args}, 201
    
class Hotel(Resource):
    def get(self, identifier):
        shelf = get_hotels_db()

        if not identifier in shelf:
            return {'messages': 'Hotel not found'}, 404

        return {'data': shelf[identifier]}, 200

    def delete(self, identifier):
        shelf = get_hotels_db()

        if not identifier in shelf:
            return {'messages': 'Hotel not found'}, 404

        del shelf[identifier]

        return {''}, 204