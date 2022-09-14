# Program file for Sender Module of Local Operations System
# ECD210
# Ricky Chen & Jennifer Thakkar

import requests

# This changes I think every time ngrok gets rerun. During testing start an ngrok session and leave it open in a separate terminal
url = 'https://1e6e-2603-7081-5b02-8741-cd81-b023-cbb3-f2b6.ngrok.io'

file = open('data.json', 'rb').read()
# headers?
x = requests.post(url, file)
