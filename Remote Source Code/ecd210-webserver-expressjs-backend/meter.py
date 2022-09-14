# Program file for meter class and related functions on remote server
# ECD210
# Jennifer Thakkar

import sqlite3
from sqlite3 import Error
import json
import random

class Meter:
    """
    id = Database ID of the meter
    ip = IP Address assigned to the meter
    active = (running, stopped) Current State of the meter
    meterType = (low, medium, high) Adjustment to the range of values the meter will produce
    """

    def __init__(self, id, ip, active = "running"):
        self.id = id
        self.ip = ip
        self.active = active
        self.user_name = 'username'

        #Setup the database for this meter
        self.dbString = "meter" + str(id) + "_db"
        self.conn = self.openDatabase()
        if(self.conn is not None):
            self.createTable()

    def __str__(self):
        return "Meter " + str(self.id) + ": <" + self.ip + ", " + self.active + ">"

    def openDatabase(self):
        try:
            conn = sqlite3.connect(self.dbString, isolation_level=None)
        except Error as e:
            print(e)
        finally:
            return conn
    def createTable(self):
        sql_string = "CREATE TABLE IF NOT EXISTS data(meter_id INTEGER, user_name TEXT NOT NULL, realPowerMin NOT NULL, realPowerMax NOT NULL, realPowerAvg NOT NULL, apparentPowerMin NOT NULL, apparentPowerMax NOT NULL, apparentPowerAvg NOT NULL, voltageMin NOT NULL, voltageMax NOT NULL, voltageAvg NOT NULL, currentMin NOT NULL, currentMax NOT NULL, currentAvg NOT NULL, longitude NOT NULL, latitude NOT NULL);"
        c = self.conn.cursor()
        c.execute(sql_string)

    # The file that gets the data from Sabrina's database will call this function. 
    def insertData(self, timeStamp, realPower, apparentPower, voltage, current):
        sql_string = "INSERT INTO data(self.id, self.user_name, realPowerMin, realPowerMax, realPowerAvg, apparentPowerMin, apparentPowerMax, apparentPowerAvg, voltageMin, voltageMax, voltageAvg, currentMin, currentMax, currentAvg, longitude, latitude)"
        
        self.conn.cursor().execute(sql_string, (timeStamp, realPowerMin, realPowerMax, realPowerAvg, reactivePowerMin, reactivePowerMax,reactivePowerAvg, voltageMin, voltageMax, voltageAvg, currentMin, currentMax, currentAvg, 42, 42))

    def getData(self, timeStamp):
        sql_string = "SELECT * FROM data"
        self.conn.row_factory = sqlite3.Row
        rows = self.conn.cursor().execute(sql_string).fetchall()
        return json.dumps([dict(ix) for ix in rows])

    def deleteAllData(self):
        sql_string = "DELETE FROM data"
