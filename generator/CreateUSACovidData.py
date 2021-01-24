from __future__ import print_function
import csv
# import numpy as np
import json
# from colour import Color
import math
import USAStateFips

states = {}
stateCodes = {}
stateNames = {}

with open('counties.json', 'r') as f:
    counties = json.loads(f.read())

# @Dragon946470 - where did you get this data? 
DAYS = ['3.26']
STATE_POPS = {'30': 1005494, '54': 1856680, '42': 12764475, '48': 26060796, '45': 4723417, '50': 625953, '49': 2854871, '53': 6895318, '02': 730307, '25': 6645303, '26': 9882519, '01': 4817528, '06': 37999878, '21': 4379730, '04': 6551149, '05': 2949828, '46': 834047, '47': 6454914, '08': 5189458, '09': 3591765, '28': 2986450, '29': 6024522, '40': 3815780, '41': 3899801, '51': 8186628, '24': 5884868, '56': 576626, '39': 11553031, '27': 5379646, '72': 3651545, '20': 2885398, '38': 701345, '11': 633427, '10': 917053, '13': 9915646, '12': 19320749, '15': 1390090, '22': 4602134, '17': 12868192, '16': 1595590, '19': 3075039, '18': 6537782, '31': 1855350, '23': 1328501, '37': 9748364, '36': 19576125, '35': 2083540, '34': 8867749, '33': 1321617, '55': 5724554, '32': 2754354, '44': 1050304}

stateTotalCases = {}
nytCountyDaily = {}

with open('covid-19-data/us-states.csv', 'r') as f:
    nyt_covid_data = f.readlines()
    nyt_covid_data.pop(0)

with open('covid-19-data/us-counties.csv', 'r') as f:
    nyt_county_data = f.readlines()
    nyt_county_data.pop(0)

with open('USA-Counties-NYT-Extra.csv', 'r') as f:
    nyt_county_data += f.readlines()

for line in nyt_covid_data:
    line=line.strip()
    date,state,fips,cases,deaths = line.split(',')
    if date not in stateTotalCases:
        stateTotalCases[date] = {}

    stateTotalCases[date][fips] = [ int(cases), int(deaths) ]

for line in nyt_county_data:
    line=line.strip()
    date,county,state,fips,cases,deaths = line.split(',')
    if date not in nytCountyDaily:
        nytCountyDaily[date] = []

    nytCountyDaily[date].append([county,state,fips,cases,deaths])

with open('../docs/data/global/country-daily.json') as f:
    global_daily = json.loads(f.read())

def get_jhu_dfd(day, month, year):
    i = 0
    day = int(day)
    month = int(month)
    year = '20'
    for (k,d) in enumerate(global_daily['days']):
        s = '%s/%s/%s'%(month, day, year)
        # print(k,d,s)
        if s == d:
            return global_daily['daily'][k]['US']
    print('jhu fail', day, month, year)
    raise AssertionError()

# LOCALITY: NYC

with open('coronavirus-data/totals/data-by-modzcta.csv', 'r') as f:
    nyc_covid_data = f.readlines()
    nyc_covid_data.pop(0)

# with open('nyc-coronavirus-data/testing.csv', 'r') as f:
#     nyc_daily_data = f.readlines()
#     nyc_daily_data.pop(0)

with open('coronavirus-data/trends/data-by-day.csv', 'r') as f:
    nyc_daily_data2 = f.readlines()
    nyc_daily_data2.pop(0)

with open('coronavirus-data/totals/summary.csv', 'r') as f:
    nyc_summary = f.readlines()

# with open('coronavirus-data/totals/boro.csv', 'r') as f:
#     boro_data = f.readlines()
#     boro_data.pop(0)

with open('coronavirus-data/totals/by-sex.csv', 'r') as f:
    nyc_sex_data = f.readlines()
    nyc_sex_data.pop(0)

nycCases = {}
nycTotals = {}
nycDaily = []
nycBoroRates = {}
nycSexData = {}

for line in nyc_covid_data:
    MODIFIED_ZCTA,NEIGHBORHOOD_NAME,BOROUGH_GROUP,COVID_CASE_COUNT,COVID_CASE_RATE,POP_DENOMINATOR,COVID_DEATH_COUNT,COVID_DEATH_RATE,PERCENT_POSITIVE,TOTAL_COVID_TESTS = line.strip().replace('"', '').split(',')
    zipcod = MODIFIED_ZCTA.replace('"', "")

    nycCases[zipcod] = [ int(COVID_CASE_COUNT), int(TOTAL_COVID_TESTS) ]


# for line in boro_data:
#     BOROUGH_GROUP,COVID_CASE_COUNT,COVID_CASE_RATE=line.strip().split(',')
#     nycBoroRates[BOROUGH_GROUP] = [ int(COVID_CASE_COUNT), float(COVID_CASE_RATE or 0) ]

# for line in nyc_daily_data:
#     extract_date,specimen_date,Number_tested,Number_confirmed,Number_hospitalized,Number_deaths=line.strip().split(',')
#     nycDaily.append([ specimen_date, Number_confirmed, Number_hospitalized, Number_deaths, Number_tested, extract_date ])

for line in nyc_daily_data2:
    date_of_interest,CASE_COUNT,PROBABLE_CASE_COUNT,HOSPITALIZED_COUNT,DEATH_COUNT,PROBABLE_DEATH_COUNT,CASE_COUNT_7DAY_AVG,ALL_CASE_COUNT_7DAY_AVG,HOSP_COUNT_7DAY_AVG,DEATH_COUNT_7DAY_AVG,ALL_DEATH_COUNT_7DAY_AVG,BX_CASE_COUNT,BX_PROBABLE_CASE_COUNT,BX_HOSPITALIZED_COUNT,BX_DEATH_COUNT,BX_PROBABLE_DEATH_COUNT,BX_CASE_COUNT_7DAY_AVG,BX_ALL_CASE_COUNT_7DAY_AVG,BX_HOSPITALIZED_COUNT_7DAY_AVG,BX_DEATH_COUNT_7DAY_AVG,BX_ALL_DEATH_COUNT_7DAY_AVG,BK_CASE_COUNT,BK_PROBABLE_CASE_COUNT,BK_HOSPITALIZED_COUNT,BK_DEATH_COUNT,BK_PROBABLE_DEATH_COUNT,BK_CASE_COUNT_7DAY_AVG,BK_ALL_CASE_COUNT_7DAY_AVG,BK_HOSPITALIZED_COUNT_7DAY_AVG,BK_DEATH_COUNT_7DAY_AVG,BK_ALL_DEATH_COUNT_7DAY_AVG,MN_CASE_COUNT,MN_PROBABLE_CASE_COUNT,MN_HOSPITALIZED_COUNT,MN_DEATH_COUNT,MN_PROBABLE_DEATH_COUNT,MN_CASE_COUNT_7DAY_AVG,MN_ALL_CASE_COUNT_7DAY_AVG,MN_HOSPITALIZED_COUNT_7DAY_AVG,MN_DEATH_COUNT_7DAY_AVG,MN_ALL_DEATH_COUNT_7DAY_AVG,QN_CASE_COUNT,QN_PROBABLE_CASE_COUNT,QN_HOSPITALIZED_COUNT,QN_DEATH_COUNT,QN_PROBABLE_DEATH_COUNT,QN_CASE_COUNT_7DAY_AVG,QN_ALL_CASE_COUNT_7DAY_AVG,QN_HOSPITALIZED_COUNT_7DAY_AVG,QN_DEATH_COUNT_7DAY_AVG,QN_ALL_DEATH_COUNT_7DAY_AVG,SI_CASE_COUNT,SI_PROBABLE_CASE_COUNT,SI_HOSPITALIZED_COUNT,SI_DEATH_COUNT,SI_PROBABLE_DEATH_COUNT,SI_CASE_COUNT_7DAY_AVG,SI_ALL_CASE_COUNT_7DAY_AVG,SI_HOSPITALIZED_COUNT_7DAY_AVG,SI_DEATH_COUNT_7DAY_AVG,SI_ALL_DEATH_COUNT_7DAY_AVG,INCOMPLETE=line.strip().split(',')
    nycBoroRates['The Bronx'] = [ int(BX_CASE_COUNT), float(BX_DEATH_COUNT) ]
    nycBoroRates['Brooklyn'] = [ int(BK_CASE_COUNT), float(BK_DEATH_COUNT) ]
    nycBoroRates['Manhattan'] = [ int(MN_CASE_COUNT), float(MN_DEATH_COUNT) ]
    nycBoroRates['Queens'] = [ int(QN_CASE_COUNT), float(QN_DEATH_COUNT) ]
    nycBoroRates['Staten Island'] = [ int(SI_CASE_COUNT), float(SI_DEATH_COUNT) ]
    nycBoroRates['Citywide'] = [ int(CASE_COUNT), float(DEATH_COUNT) ]

    nycDaily.append([ date_of_interest, CASE_COUNT, HOSPITALIZED_COUNT, DEATH_COUNT, 0, date_of_interest ])

for line in nyc_sex_data:
    SEX_GROUP,COVID_CASE_RATE,HOSPITALIZED_CASE_RATE,DEATH_RATE,CASE_COUNT,HOSPITALIZED_COUNT,DEATH_COUNT=line.strip().split(',')
    nycSexData[SEX_GROUP] = [float(COVID_CASE_RATE),float(HOSPITALIZED_CASE_RATE),float(DEATH_RATE), float(CASE_COUNT), float(HOSPITALIZED_COUNT), float(DEATH_COUNT)]

for line in nyc_summary:
    key,val = line.strip().split(',', 1)
    key = key.lower()

    # ?!:
    if 'case' in key:
        nycTotals['cases'] = val
    elif 'confirmed' in key:
        nycTotals['deaths'] = val
    elif 'date' in key:
        nycTotals['updated'] = val.replace('"', '')
    elif 'hosp' in key:
        nycTotals['hosp'] = val.replace('"', '')
    elif 'probable' in key:
        nycTotals['probable'] = val.replace('"', '')

# END NYC

def work(src, fileName, day):
    _month, _day, _year = day.split('-')
    _daystr = '%s-%s-%s' % (_year, _month, _day)

    try:
        country_data_for_day = get_jhu_dfd(_day, _month, _year)
    except Exception:
        print('Failed', src, fileName, day, 'because no JHU data')
        return
    # print(country_data_for_day)

    if src == 'jhu':
        with open(fileName) as File: #the csv file is stored in a File object
            reader=csv.reader(File)       #csv.reader is used to read a file
            first = True
            for row in reader:
                # print(row)
                if first:
                    first = False
                    continue

                if len(row) == 12:
                    FIPS,Admin2,Province_State,Country_Region,Last_Update,Lat,Lng,Confirmed,Deaths,Recovered,Active,Combined_Key=row
                    if Country_Region == 'US':
                        try:
                            pop12 = int(counties[FIPS]['pop12'])
                        except Exception:
                            # print 'FAILED', FIPS
                            pop12 = 1

                        try:
                            stateCode = USAStateFips.stateToFips[Province_State]
                        except Exception:
                            stateCode = FIPS[0:2]
                            print('Fail', Province_State, stateCode)

                        if stateCode in states:
                            states[stateCode].append([FIPS, Confirmed, Deaths, Recovered, Active, pop12])
                        else:
                            states[stateCode] = [[FIPS, Confirmed, Deaths, Recovered, Active, pop12]]

                        stateCodes[stateCode] = Province_State
                elif len(row) == 6:
                    ProvinceState,CountryRegion,LastUpdate,Confirmed,Deaths,Recovered = row
                    if CountryRegion == 'US':
                        stateCode = None
                        if 'From' in ProvinceState:
                            continue
                        if ',' in ProvinceState:
                            county, state = ProvinceState.split(',')
                            stateCode = USAStateFips.stateCodeToFips[state.strip()]
                        else:
                            stateCode = USAStateFips.stateToFips[ProvinceState]

                        if stateCode in states:
                            states[stateCode].append([0, Confirmed, Deaths, Recovered, Confirmed, 0])
                        else:
                            states[stateCode] = [[0, Confirmed, Deaths, Recovered, Confirmed, 0]]

                        print(ProvinceState,'->',stateCode)

    elif src == 'nyt':

        recoveriesForFips = {}

        with open(fileName) as File: #the csv file is stored in a File object
            reader=csv.reader(File)       #csv.reader is used to read a file
            first = True
            for row in reader:
                # print(row)
                if first:
                    first = False
                    continue

                if len(row) == 12:
                    FIPS,Admin2,Province_State,Country_Region,Last_Update,Lat,Lng,Confirmed,Deaths,Recovered,Active,Combined_Key=row
                    recoveriesForFips[FIPS] = Recovered

        

        dfd = nytCountyDaily[_daystr]
        for row in dfd:
            # print (row)
            county,state,FIPS,cases,deaths = row
            Confirmed = int(cases)
            Deaths = int(deaths or 0)
            try:
                Recovered = int(recoveriesForFips[FIPS])
            except Exception:
                Recovered = 0
            Active = Confirmed

            try:
                pop12 = int(counties[FIPS]['pop12'])
            except Exception:
                # print 'FAILED', FIPS
                pop12 = 1

            stateCode = FIPS[0:2]
            if not FIPS:
                # if county == 'New York City'
                # print('NO FIPS CODE FOR', county, state)
                stateCode = USAStateFips.stateToFips[state]
                # print('++ nEw state code', stateCode)


            if stateCode in states:
                states[stateCode].append([FIPS, Confirmed, Deaths, Recovered, Active, pop12])
            else:
                states[stateCode] = [[FIPS, Confirmed, Deaths, Recovered, Active, pop12]]

            stateCodes[stateCode] = county

    # print(stateCodes)

    ceiling = 0
    confirmed_cases = {}
    confirmed_pers = {}

    all_recoveries_Count = 0
    confirmed_cases_allstates = []
    confirmed_deaths_allstates = []
    confirmed_recoveries_allstates = []

    for state in states:
        cases_statewide = 0
        for fipsc in states[state]:
            # print fipsc
            FIPS, Confirmed, Deaths, Recovered, Active, pop12 = fipsc

            if not pop12:
                continue

            confirmed = int(Confirmed)

            if state in confirmed_cases:
                confirmed_cases[state].append(confirmed)
            else:
                confirmed_cases[state] = [confirmed]

            cases_statewide += confirmed

            div = (float(confirmed) / float(pop12)) * 100
            # print confirmed, '/', pop12, div

            if state in confirmed_pers:
                confirmed_pers[state].append(div)
            else:
                confirmed_pers[state] = [div]

            ceiling = max(ceiling, confirmed)

        confirmed_cases_allstates.append(cases_statewide)
        all_recoveries_Count += Recovered

    for state in confirmed_cases:
        confirmed_cases[state].sort()
        confirmed_pers[state].sort()

    confirmed_cases_allstates.sort()

    # print confirmed_pers

    stateColors = {}
    stateCasesPer100k = {}
    stateDeathsPer100k = {}

    fipsColors = {}
    fipsCasesPer10k = {}

    # _red = Color("yellow")
    # _colors = ['#555732', '#f0fd00', '#fddb00', '#fdba00', '#fd9c00'] + list(_red.range_to(Color("darkred"), 20))

    for state in states:
        # try:
        #     red = Color("green")
        #     colors = list(red.range_to(Color("red"), len(confirmed_cases[state])))
        # except Exception:
        #     pass

        statewidecases = 0
        statewidedeaths = 0

        for fipsc in states[state]:
            # print fipsc
            FIPS, Confirmed, Deaths, Recovered, Active, pop12 = fipsc

            confirmed = int(Confirmed)
            deaths = int(Deaths)
            statewidecases += confirmed
            statewidedeaths += deaths

            if confirmed == 0:
                fipsColors[FIPS] = '#010101'
                continue

            if pop12 == 0:
                continue

            div = (float(confirmed) / float(pop12)) * 1000

            cases_per_100k = math.ceil((float(confirmed) / float(pop12)) * 10000)

            fipsCasesPer10k[FIPS] = [int(cases_per_100k), confirmed, int(Deaths), int(Recovered)]
            
            # i = 0
            # while i < len(confirmed_cases[state]):
            #     if div == confirmed_pers[state][i]:
            #         fipsColors[FIPS] = str(colors[i])          
            #     # if confirmed_cases[i] == confirmed:
            #     #     # print FIPS, 'color is', colors[i]
            #     #     fipsColors[FIPS] = str(colors[i])
            #     i += 1


        epicenter_count = confirmed_cases_allstates[len(confirmed_cases_allstates) - 1]
        if statewidecases != epicenter_count:
            statewidecases *= 1
        # if epicenter_count < 1000:
        #     epicenter_count = 500


        # percent = int(min(100, math.ceil((float(statewidecases) / float(epicenter_count)) * 100)))
        # print percent, statewidecases, epicenter_count

        # stateColors[state] = str(_colors[percent - 1])

        try:
            spop = STATE_POPS[state]
            percent = float(statewidecases) / float(spop)
            percent_fixed = max(1, min(100, int(percent * 50000)) / 4)
            # print state, percent * 50000, percent_fixed
            # stateColors[state] = str(_colors[int(percent_fixed) - 1])
            stateCasesPer100k[state] = int(math.ceil(percent * 100000))

            percent_death = float(statewidedeaths) / float(spop)
            stateDeathsPer100k[state] = int(math.ceil(percent_death * 100000))
        except Exception:
            pass

        # j = 0
        # while j < len(confirmed_cases_allstates):
        #     if statewidecases == confirmed_cases_allstates[j]:
        #         stateColors[state] = str(_colors[j])
        #     j += 1

    # print p

    # print confirmed_cases_allstates

    # print json.dumps(stateColors)


    out = {}
    for state in states:
        # print(state,_daystr,state, states[state], stateTotalCases[_daystr])
        # if state == '66':
            # continue
        if state not in stateCasesPer100k:
            print('Failed FIPS', state)
            continue
        out[state] = [ 0, stateTotalCases[_daystr][state], [stateCasesPer100k[state], stateDeathsPer100k[state]] ]

        # try:
        #     # out[state] = [ stateColors[state], stateTotalCases[_daystr][state] ]
        # except Exception, e:
        #     print(e)
        #     print('Out Failed', state, state in stateColors, state in stateTotalCases[_daystr])
        #     pass

    __cases = []
    __cases_sum = 0
    __deaths = []
    __deaths_sum = 0
    __recoveries_sum = country_data_for_day[2]
    for state in states:
        __cases_sum += stateTotalCases[_daystr][state][0]
        __cases.append([stateTotalCases[_daystr][state][0], state])
        __deaths_sum += stateTotalCases[_daystr][state][1]
        __deaths.append([stateTotalCases[_daystr][state][1], state])

    __cases.sort()
    __deaths.sort()
    __cases.reverse()
    __deaths.reverse()

    print(__cases, __deaths)

    return [out, fipsCasesPer10k,  [ __cases_sum, __deaths_sum, __recoveries_sum ], [ __cases[0:10], __deaths[0:10] ] ]
    # return [stateColors, stateTotalCases[_day]]
    # print json.dumps(fipsColors)

    

def work_nyc():
    # todo: day-by-day data
    pass

entries = []

# for fil in files.split('\n'):
#     print fil
#     ret = work('jhu', 'COVID-19/csse_covid_19_data/csse_covid_19_daily_reports/'+fil, fil.replace('.csv', ''))
#     entries.append([fil, ret[0], ret[1]])

import os

files = os.listdir('COVID-19/csse_covid_19_data/csse_covid_19_daily_reports/')
files.pop(0)
files.pop(-1)

ml = ''

for fil in files:
    print(fil)

    try:
        ret = work('nyt', 'COVID-19/csse_covid_19_data/csse_covid_19_daily_reports/'+fil, fil.replace('.csv', ''))
        if not ret:
            continue
        entries.append([fil, ret[0], ret[1], ret[2], ret[3]])
    except Exception as e:
        ml += '------------------- FAILED ------------\n'
        ml += fil
        print(fil,e)

with open('../docs/data/usa/covid19-states-daily.json', 'w') as f:
    f.write(json.dumps(entries))

with open('../docs/data/usa/covid19-nyc-allcases.json', 'w') as f:
    f.write(json.dumps(nycCases))

with open('../docs/data/usa/covid19-nyc-daily.json', 'w') as f:
    f.write(json.dumps({ 'daily': nycDaily, 'totals': nycTotals, 'boro': nycBoroRates, 'sex': nycSexData }))

print(ml)