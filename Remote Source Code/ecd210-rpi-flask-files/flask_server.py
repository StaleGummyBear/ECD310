# Program file for the Flask server that runs on the
# Local Operations System
# ECD109
# Denis Nakazawa

import sqlite3

from energy_information_database import *
from flask import Flask, render_template, request

app = Flask(__name__)

@app.route("/")
def render_local_interface():
    time_stamp, real_power_min, real_power_max, real_power_avg, reactive_power_min, reactive_power_max, reactive_power_avg, voltage_min, voltage_max, voltage_avg, current_min, current_max, current_avg, energy = retrieve_last_database_entry()
    
    template_data = {
        'timeStamp'        : time_stamp,
        'realPowerMin'     : real_power_min,
        'realPowerMax'     : real_power_max,
        'realPowerAvg'     : real_power_avg,
        'reactivePowerMin' : reactive_power_min,
        'reactivePowerMax' : reactive_power_max,
        'reactivePowerAvg' : reactive_power_avg,
        'voltageMin'       : voltage_min,
        'voltageMax'       : voltage_max,
        'voltageAvg'       : voltage_avg,
        'currentMin'       : current_min,
        'currentMax'       : current_max,
        'currentAvg'       : current_avg,
        'energy'           : energy
    }
    
    return render_template('index.html', **template_data)

if __name__ == "__main__":
    app.run(host = '192.168.1.91', port = 24, debug = True)