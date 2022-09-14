import csv
from datetime import datetime
import importlib
import PCA_Final
from PCA_Final import *

time_min = datetime.now().strftime('%H:%M:%S')
real_power_value = Power_Calc()[2]
apparent_power_value = Power_Calc()[3]

fieldnames = ["time_min", "real_power_value", "apparent_power_value"]
with open('data.csv', 'w') as csv_file:
    csv_writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
    csv_writer.writeheader()

reader = csv.reader(open("data.csv"))
lines = len(list(reader))

while True:
    with open('data.csv', 'a') as csv_file:
        csv_writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
        info = {
            "time_min": time_min,
            "real_power_value": real_power_value,
            "apparent_power_value": apparent_power_value

        }
        csv_writer.writerow(info)
        print(time_min, real_power_value, apparent_power_value)

        time_min = datetime.now().strftime('%H:%M:%S')

        importlib.reload(PCA_Final)
        real_power_value = Power_Calc()[2]
        apparent_power_value = Power_Calc()[3]

    #time.sleep(60)
