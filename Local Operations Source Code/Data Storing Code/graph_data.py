import pandas as pd
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
import gc

gc.collect()


# plot fit to the raspberry pi screen
def cm_to_inch(value):
    return value / 2.54


plt.figure(figsize=(cm_to_inch(15.5), cm_to_inch(8.6)))


# set style
plt.style.use('fivethirtyeight')
x_vals = []
y_vals = []


# read from csv file
def animate(i):
    data = pd.read_csv('data.csv')
    x = data['time_min'][-10:]
    y1 = data['real_power_value'][-10:]
    y2 = data['apparent_power_value'][-10:]

    plt.cla()

    # plot
    plt.ylabel('Power (in Watts)', fontsize=7)

    plt.xticks(fontsize=7, rotation=30, ha='right')
    plt.yticks(fontsize=7)
    plt.subplots_adjust(bottom=0.30)

    plt.plot(x, y1, 'o-', label='Real Power Consumption')
    plt.plot(x, y2, 'o-', label='Apparent Power Consumption')

    plt.legend(loc='lower right', fontsize=7)
    plt.tight_layout()
    plt.title("Electricity Usage", fontsize=10)


# Use FuncAnimation to execute
ani = FuncAnimation(plt.gcf(), animate, interval=15, blit=False)

plt.tight_layout()
plt.show()
