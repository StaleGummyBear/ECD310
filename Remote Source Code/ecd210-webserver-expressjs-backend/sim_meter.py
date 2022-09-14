import sqlite3
import json
import meter
import time

from datetime import datetime
from sqlite3 import Error

#Constants
DATABASE = "meters_db"



def create_connection(db_file):
    conn = None
    try:
        conn = sqlite3.connect(db_file, isolation_level=None)
        print(sqlite3.version)
    except Error as e:
        print(e)
    finally:
        return conn

def run_sql(conn, sql_string):
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    rows = c.execute(sql_string).fetchall()
    return json.dumps([dict(ix) for ix in rows])

def main():
    conn = create_connection(DATABASE)
    if(conn is None):
        print("Could not connect to database")
        exit()

    print("Successfully Connected to " + DATABASE)
    print(run_sql(conn, "SELECT * from meters"))
    #run_sql(conn, "DROP TABLE IF EXISTS meters;")
    run_sql(conn, "CREATE TABLE IF NOT EXISTS meters(id integer PRIMARY KEY, meterIP string, active string check(active = 'running' or active = 'stopped'));")


    metersList = run_sql(conn, "SELECT * from meters")
    meterObjects = []
    metersList = json.loads(metersList)
    # fill meterObjects array with meters in the system
    for m in metersList:
        print(m)
        meterObjects.append(meter.Meter(m['id'], m['meterIP'], m['active']))

    dt_string = datetime.now(tz=None).strftime("%m.%d.%Y.%H:%M")
    print(dt_string)

    starttime=time.time()
    # sim meter data simulation loop
    while(True):
        metersList = run_sql(conn, "SELECT * from meters")
        meterObjects = []
        metersList = json.loads(metersList)
        dt_string = datetime.now().strftime("%m.%d.%Y.%H:%M")
        for m in metersList:
            print(m)
            meterObjects.append(meter.Meter(m['id'], m['meterIP'], m['active']))
        for m in meterObjects:
            if (m.id == 6):
                print("Meter " + str(m.id) + " is running physical meter process")
                #code for reading from Pi
                if (m.active == 'running'):
                    # physical meter is turned on
                    print("Physical meter running")
                else:
                    # physical meter is turned off
                    print("Physical meter is currently stopped")
            else:
                print("Meter " + str(m.id) + "is running simulated meter process")
                m.generateData(dt_string)
                # print(str(m.id) + ": " + str(m.getData(dt_string)))
        time.sleep(60.0 - ((time.time() - starttime) % 60.0))

    conn.close()
main()
