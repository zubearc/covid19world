import os, subprocess
from datetime import date
today = str(date.today())

def system(cmd):
    print(">", cmd)
    exit_code = subprocess.call(cmd, shell=True)
    if exit_code != 0:
        raise ValueError("Expected zero exit code, got " + str(exit_code))

# Update the git submodles
print("Updating git submodules...")
# https://stackoverflow.com/a/9103113/11173996
# does this work? To be tested
system('git submodule -q foreach git pull -q origin master')

system('cd nyc && python fixNytData.py')

# hey this works :D
import CreateGlobalCovidData
import CreateUSACovidData

# system('git add coronavirus-data COVID-19 covid-19-data && git commit -m "update data %s"' % today)
# if os.name == 'win32':
#     os.system('.\\update.bat')
# else:
#     os.system('bash ./update.sh')
