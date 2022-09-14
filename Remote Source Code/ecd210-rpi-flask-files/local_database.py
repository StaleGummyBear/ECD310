import sqlite3
from datetime import datetime
import importlib
import PCA_test
from PCA_test import *
import json

time_min = datetime.now().strftime('%H:%M:%S')


# number_of_rows = cursor.execute("SELECT * FROM Power_Usage")


def create_database():
    connection = sqlite3.connect('power_store.db')
    cursor = connection.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS Power_Usage (Time_sampled INTEGER, RMS_voltage BLOB, RMS_current 
    BLOB, Real_power BLOB, Apparent_power BLOB, Inst_power BLOB)''')

    connection.commit()
    connection.close()


def insert_data():
    conn = sqlite3.connect('power_store.db')
    cur = conn.cursor()
    sql = 'insert into Power_Usage(Time_sampled, RMS_voltage, RMS_current, Real_power, ' \
          'Apparent_power, Inst_power)''values(?,?,?,?,?,?)'
    data = (time_min, Power_Calc()[0], Power_Calc()[1], Power_Calc()[2], Power_Calc()[3], Power_Calc()[4])
    cur.execute(sql, data)
    conn.commit()
    conn.close()


def create_json():
    conn = sqlite3.connect('power_store.db')
    cur = conn.cursor()
    query = "SELECT * FROM Power_Usage"
    result = cur.execute(query)
    items = []
    for row in result:
        items.append({'Time_sampled': row[0], 'RMS_voltage': row[1], 'RMS_current': row[2], 'Real_power': row[3],
                      'Apparent_power': row[4], 'Inst_power': row[5]})

    conn.close()
    # print(json.dumps({'items': items}))
    json_object = json.dumps(items, indent=4)
    with open("data.json", "w") as outfile:
        outfile.write(json_object)


def update_json():
    conn = sqlite3.connect('power_store.db')
    cur = conn.cursor()
    query = "SELECT * FROM Power_Usage"
    result = cur.execute(query)
    items = []
    for row in result:
        items.append({'Time_sampled': row[0], 'RMS_voltage': row[1], 'RMS_current': row[2], 'Real_power': row[3],
                      'Apparent_power': row[4], 'Inst_power': row[5]})

    conn.close()
    # print(json.dumps({'items': items}))
    json_object = json.dumps(items, indent=4)
    with open("data.json", "w") as outfile:
        outfile.write(json_object)


def num_lines():
    conn = sqlite3.connect('power_store.db')
    cur = conn.cursor()
    query = "SELECT * FROM Power_Usage"
    result = cur.execute(query)
    line_count = len(list(result))
    conn.commit()
    conn.close()
    return line_count

def clear_table():
    conn = sqlite3.connect('power_store.db')
    cur = conn.cursor()
    cur.execute('DELETE FROM Power_Usage;')
    conn.commit()
    conn.close()


create_database()
create_json()

while True:
    insert_data()
    importlib.reload(PCA_test)
    time_min = datetime.now().strftime('%H:%M:%S')
    if num_lines() == 57600:
        clear_table()
    update_json()
    time.sleep(60)
