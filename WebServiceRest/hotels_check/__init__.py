import markdown
import os
import shelve

from flask import Flask, g
from flask_restful import Resource, Api, reqparse

from hotels_check import booking, hotel

# Create an instance of Flask
app = Flask(__name__)

# Create the API
api = Api(app)

@app.teardown_appcontext
def teardown_db(exception):
    db = getattr(g, "_database", None)
    if db is not None:
        db.close()

@app.route("/")
def index():
    """ DOCUMENTATION """

    #Open the README file
    with open(os.path.dirname(app.root_path) + '/README.md', 'r') as markdown_file:

        #Read the content of the file
        content = markdown_file.read()

        return markdown.markdown(content)

api.add_resource(hotel.HotelsList, '/hotels')
api.add_resource(hotel.Hotel, '/hotel/<string:identifier>')
api.add_resource(booking.BookingList, '/bookings')
api.add_resource(booking.Booking, '/booking/<string:identifier>')
api.add_resource(booking.AskBooking, '/ask_booking')