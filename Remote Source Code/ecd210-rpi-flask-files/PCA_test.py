# from scipy import signal
import random
import time
from math import pow

import numpy as np


# import board
# import busio
# import adafruit_ads1x15.ads1015 as ADS
# from adafruit_ads1x15.analog_in import AnalogIn
# from adafruit_ads1x15.ads1x15 import Mode


def Power_Calc():
    # Initialization
    pi = np.pi
    Fs = 2400  # Sampling rate
    # Fs = 2400 #Sampling rate
    Ts = 1 / Fs  # Sampling period
    f = 60  # Frequency of household power
    # t_total=0.1
    t_total = 0.8

    N_total = int(Fs * t_total)  # Total number of samples

    # i2c = busio.I2C(board.SCL, board.SDA)  # Setting up I2C
    #
    # ads = ADS.ADS1015(i2c)  # Creating ADS object
    #
    # # Data collection setup
    # ads.gain = 1  # ADS1015 has an internal PGA
    #
    # chan0 = AnalogIn(ads, ADS.P0)  # Creates channel object for analog input on A0
    # chan1 = AnalogIn(ads, ADS.P1)  # Creates channel object for analog input on A1
    #
    # ads.mode = Mode.CONTINUOUS  # ADC can be run in continuous or single-shot modes
    # ads.data_rate = Fs  # ADC is capable of 128, 250, 490, 920, 1600, 2400, and 3300 SPS

    # ANS = input("Calibrate Voltage Sensor: (Y/N) ")
    #
    # if ANS == 'Y':
    #     V_SF = voltage_calibration()
    # else:
    # V_SF = 800
    V_SF = 763  # adjusted this to actual value

    # Pre-allocating arrays with zeros
    V_RAW = np.zeros(N_total)
    I_RAW = np.zeros(N_total)

    V = 0
    I = 0
    P_ins = 0
    V_square = 0
    I_square = 0

    i = 0

    SAMPLES = N_total - 1

    while True:
        time.sleep(Ts)  # Want to sample every Ts

        if i == SAMPLES:
            break
        else:
            V_RAW[i] = 0.1 + random.uniform(0.01, 0.3)  # Reads voltage value on A0
            I_RAW[i] = 0.25 + random.uniform(0.25, 1.0)  # Reads current value on A1
            i = i + 1

            # Filtered Signals
    VDC = np.sum(V_RAW) / SAMPLES  # Average voltage value is the DC offset
    IDC = np.sum(I_RAW) / SAMPLES  # Average current value is the DC offset

    # Mitigates DC offset
    V_noDC = V_RAW - VDC
    I_noDC = I_RAW - IDC

    V = np.max(np.abs(V_noDC[1:N_total - 30]))
    I = np.max(np.abs(I_noDC[1:N_total - 30]))

    P_ins = (15.9 * pow(I, 2) + 10.1 * I - 0.045) * V * V_SF

    # Average Raw values

    V_avg = np.sum(np.abs(V_noDC[1:N_total - 30])) / (SAMPLES - 30)
    I_avg = np.sum(np.abs(I_noDC[1:N_total - 30])) / (SAMPLES - 30)

    real_power = P_ins - ((15.9 * pow(I_avg, 2) + 10.1 * I_avg - 0.045) * V_avg * V_SF)

    mean_square_current = np.sum(I_noDC[1:N_total - 30] * I_noDC[1:N_total - 30]) / (SAMPLES - 30)
    mean_square_voltage = np.sum(V_noDC[1:N_total - 30] * V_noDC[1:N_total - 30]) / (SAMPLES - 30)

    rms_voltage = V * np.sqrt(2) / 2 * V_SF
    rms_current = (80 * pow(I * np.sqrt(2) / 2, 3) - 20 * pow(I * np.sqrt(2) / 2, 2) + 23 * I * np.sqrt(2) / 2 - 0.0387)
    apparent_power = rms_voltage * rms_current

    # print("V = :", rms_voltage, "Volts")
    # print("I = :", rms_current, "Amps")
    # print("P = :", real_power, "Watts")
    # print("P = :", apparent_power, "VA")
    # print("P inst = :", P_ins)

    return rms_voltage, rms_current, real_power, apparent_power, P_ins
