# Program file for setting up databases on remote server
# ECD210
# Jennifer Thakkar

import sqlite3
from sqlite3 import Error

def create_databases():
    try:
        meters_connection = sqlite3.connect('meters')
        cursor = meters_connection.cursor()
        cursor.execute('CREATE TABLE IF NOT EXISTS meters(meter_id INTEGER PRIMARY KEY AUTOINCREMENT, user_name TEXT NOT NULL, meter_database_id TEXT NOT NULL)')
        users_connection = sqlite3.connect('users')
        cursor2 = users_connection.cursor()
        cursor2.execute('''CREATE TABLE IF NOT EXISTS users(user_name TEXT NOT NULL, password TEXT NOT NULL, first_name TEXT NOT NULL, last_name TEXT NOT NULL, meter_id INTEGER, account_type INTEGER)''')
        cursor2.execute("INSERT INTO users(user_name, password, first_name, last_name, meter_id, account_type) VALUES('jthakka1', 'abc123', 'jennifer', 'thakkar', 1, 1)");
    except Error as e:
        print(e)

create_databases()
