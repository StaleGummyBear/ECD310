# Power Calculation Algorithm Vers. II 
# ECD210 Electric Smart Meter
# Updated by: Lucia Vega

# Description:
# This code calculates the real and reactive power according to the voltage and current analog inputs on the ADC

# Hardware:
# Intended to be used with an ADS1015 connected to a Raspberry Pi 4 via I2C

# Importing modules
import numpy as np
from math import sqrt,acos,pow,sin
from scipy import signal

import time
import board
import busio
import adafruit_ads1x15.ads1015 as ADS
from adafruit_ads1x15.analog_in import AnalogIn
from adafruit_ads1x15.ads1x15 import Mode
    
def Power_Calc():
    #Initialization
    pi = np.pi
    Fs = 2400 #Sampling rate
    Ts = 1/Fs #Sampling period
    f = 60 #Frequency of household power
    t_total= 1

    N_total = int(Fs*t_total) #Total number of samples


    i2c = busio.I2C(board.SCL, board.SDA) #Setting up I2C

    ads = ADS.ADS1015(i2c) #Creating ADS object

    #Data collection setup
    ads.gain = 1 #ADS1015 has an internal PGA

    chan0 = AnalogIn(ads, ADS.P0) #Creates channel object for analog input on A0
    chan1 = AnalogIn(ads, ADS.P1) #Creates channel object for analog input on A1

    ads.mode = Mode.CONTINUOUS #ADC can be run in continuous or single-shot modes
    ads.data_rate = Fs #ADC is capable of 128, 250, 490, 920, 1600, 2400, and 3300 SPS


    V_SF = 792.7    #voltage sensor calibration number
    I_SF = 20.654   #current sensor calibration number
    RP_SF = 20450   #real power calibration number
    
    #Pre-allocating arrays with zeros
    V_RAW = np.zeros(N_total) 
    I_RAW = np.zeros(N_total)

    V = 0
    I = 0
    P_ins = 0
    V_square = 0
    I_square = 0

    i = 0

    SAMPLES = N_total-1

    while True:
        time.sleep(Ts) #Want to sample every Ts
       
        if i == SAMPLES:
            break
        else:
            V_RAW[i] = chan0.voltage #Reads voltage value on A0
            I_RAW[i] = chan1.voltage #Reads current value on A1
            i = i+1        

    #Filtered Signals
    VDC = np.sum(V_RAW)/SAMPLES #Average voltage value is the DC offset
    IDC = np.sum(I_RAW)/SAMPLES #Average current value is the DC offset

    #Mitigates DC offset
    V_noDC = V_RAW - VDC 
    I_noDC = I_RAW - IDC
    
    #rms current & voltage calculations
    rms_voltage = np.sqrt(np.sum(V_noDC*V_noDC)/SAMPLES)* V_SF + 7.3382
    rms_current = np.sqrt(np.sum(I_noDC*I_noDC)/SAMPLES)* I_SF - 0.1691
    
    
    if rms_current < 0 :
        rms_current = 0
    
    #apparent and real power calculations
    apparent_power = rms_voltage * rms_current
    real_power = (np.sum(V_noDC*I_noDC)/(SAMPLES)) * RP_SF - 28
    
    # error in ADC reads real power cannot be greater than apparent power
    if real_power > apparent_power:
        real_power = apparent_power
    
    #power factor calculation  
    power_factor = real_power / apparent_power
    
    #If signal is noisy it adds this correction
    if power_factor >= 0.96:
        reactive_power = 0
    else :
        reactive_power = np.sqrt(abs(np.power(apparent_power,2) - np.power(real_power,2)))
        #reactive_power = apparent_power * sin(acos(power_factor))
        
    print("V = :",rms_voltage , "Volts")
    print("I = :", rms_current, "Amps")
#     print("S = :", apparent_power, "VA")
    print("P = :", real_power, "Watts")
    print("Q = :", reactive_power, "VAR")
#     print("PF = :", power_factor, " ")
    
    return rms_voltage, rms_current, real_power, apparent_power, reactive_power, power_factor