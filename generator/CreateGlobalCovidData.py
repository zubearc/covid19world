# This file was created March 2020
import csv,json,math
import time
import GlobalCodes

tsDays = []
tsConfirmed = {}
tsDeaths = {}
tsRecovered = {}
tsData = {}

with open('COVID-19/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv', 'r') as f:
    time_series_covid19_confirmed_global = f.readlines()

    with open('COVID-19/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv', 'r') as g:
        time_series_covid19_confirmed_US = g.readlines()
        for line in time_series_covid19_confirmed_US:
            if 'Puerto Rico' in line:
                print(line)
                t = line.split('US",')[1]
                time_series_covid19_confirmed_global.append(',Puerto Rico,18.180117000000006,-66.754367,' + t)
                # print '->',time_series_covid19_confirmed_global[-1]
                # raise time_series_covid19_confirmed_global[-1]
                # exit()

    fl = time_series_covid19_confirmed_global.pop(0)
    s = fl.strip().split(',')
    for i in range(4, len(s)):
        # print s[i]
        tsDays.append(s[i])
        tsConfirmed[s[i]] = {}

with open('COVID-19/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv', 'r') as f:
    time_series_covid19_deaths_global = f.readlines()
    with open('COVID-19/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_US.csv', 'r') as g:
        time_series_covid19_deaths_US = g.readlines()
        for line in time_series_covid19_deaths_US:
            if 'Puerto Rico' in line:
                t= line.split('US",')[1]
                t = ','.join(t.split(',')[1:]) # erase pop
                time_series_covid19_deaths_global.append(',Puerto Rico,18.180117000000006,-66.754367,' + t)
                # time_series_covid19_deaths_global.append(',Puerto Rico,' + line.split('US,')[1].replace('"Puerto Rico, US",2933408,', '').replace('.0,', ''))
                # print time_series_covid19_deaths_global[-1]

    fl = time_series_covid19_deaths_global.pop(0)
    s = fl.strip().split(',')
    for i in range(4, len(s)):
        # print s[i]
        tsDeaths[s[i]] = {}

with open('COVID-19/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv', 'r') as f:
    time_series_covid19_recovered_global = f.readlines()
    fl = time_series_covid19_recovered_global.pop(0)
    s = fl.strip().split(',')
    for i in range(4, len(s)):
        # print s[i]
        tsRecovered[s[i]] = {}


# time.sleep(1)
# print json.dumps(countyNameToIso3), len(countyNameToIso3.keys())
# exit()

countryNameToIso2 = GlobalCodes.countryNameToIso2
countryNameToIso3 = GlobalCodes.countryNameToIso3
countryPopulationsIso3 = GlobalCodes.countryPopulationsIso3

# exit()

r1 = csv.reader(time_series_covid19_confirmed_global)       #csv.reader is used to read a file
for s in r1:
    Province_State = s[0]
    Country_Region = s[1]
    Lat = s[2]
    Long = s[3]

    # if Country_Region == 'France':
    #     print s
    # print s

    name = Province_State + ',' + Country_Region
    for i in range(4, len(s)):
        # print s[i]
        x = tsDays[i - 4]
        if x not in tsConfirmed:
            tsConfirmed[x] = {}
        
        try:
            iso2 = countryNameToIso2[name]
            iso3 = countryNameToIso3[name]
        except Exception:
            # print 'did not find CC for ', name
            iso2 = countryNameToIso2[Country_Region]
            iso3 = countryNameToIso3[Country_Region]

        # if Country_Region == 'France':
        #     print iso2, iso3

        tsConfirmed[x][iso2] = s[i]
        # print(i,s)
        try:
            value = int(s[i])
        except Exception:
            print(i,s)
            raise Error()

        if x not in tsData:
            tsData[x] = {}
        if iso2 not in tsData[x]:
            tsData[x][iso2] = [0,0,0 , 0, 0, 0]

        # print x, Country_Region, value
        tsData[x][iso2][0] += value

        newval = tsData[x][iso2][0]

        try:
            _pop = countryPopulationsIso3[iso3]
            pop = int(_pop)
        except Exception:
            print('No pop for', Country_Region, iso3)
            pop = 1

        per100k = math.ceil(((float(newval) / float(pop)) * 1000000) * 100)
        # print per100k, newval, '/', pop
        tsData[x][iso2][3 + 0] = per100k
        

r1 = csv.reader(time_series_covid19_deaths_global)       #csv.reader is used to read a file
for s in r1:
    Province_State = s[0]
    Country_Region = s[1]
    Lat = s[2]
    Long = s[3]
    
    name = Province_State + ',' + Country_Region
    # print s

    for i in range(4, len(s)):
        # print tsDays

        try:
            x = tsDays[i - 4]
        except Exception:
            print(s, i, tsDays)
            # continue
            raise ''
        if x not in tsDeaths:
            tsDeaths[x] = {}
        
        try:
            iso2 = countryNameToIso2[name]
            iso3 = countryNameToIso3[name]
        except Exception:
            # print 'did not find CC for ', name
            iso2 = countryNameToIso2[Country_Region]
            iso3 = countryNameToIso3[Country_Region]

        tsDeaths[x][iso2] = s[i]

        value = int(s[i])

        if x not in tsData:
            tsData[x] = {}
        if iso2 not in tsData[x]:
            tsData[x][iso2] = [0,0,0 , 0, 0, 0]

        # print x, Country_Region, value
        tsData[x][iso2][1] += value

        newval = tsData[x][iso2][1]

        try:
            _pop = countryPopulationsIso3[iso3]
            pop = int(_pop)
        except Exception:
            print('No pop for', Country_Region, iso3)
            pop = 1

        per100k = math.ceil(((float(newval) / float(pop)) * 1000000) * 100)
        tsData[x][iso2][3 + 1] = per100k

r1 = csv.reader(time_series_covid19_recovered_global)       #csv.reader is used to read a file
for s in r1:
    Province_State = s[0]
    Country_Region = s[1]
    Lat = s[2]
    Long = s[3]

    name = Province_State + ',' + Country_Region

    for i in range(4, len(s)):
        # print s[i]
        x = tsDays[i - 4]
        if x not in tsRecovered:
            tsRecovered[x] = {}
        
        try:
            iso2 = countryNameToIso2[name]
            iso3 = countryNameToIso3[name]
        except Exception:
            # print 'did not find CC for ', name
            iso2 = countryNameToIso2[Country_Region]
            iso3 = countryNameToIso3[Country_Region]

        tsRecovered[x][iso2] = s[i]

        value = int(s[i])

        if x not in tsData:
            tsData[x] = {}
        if iso2 not in tsData[x]:
            tsData[x][iso2] = [0,0,0 , 0, 0, 0]

        # print x, Country_Region, value
        tsData[x][iso2][2] += value

        newval = tsData[x][iso2][2]

        try:
            _pop = countryPopulationsIso3[iso3]
            pop = int(_pop)
        except Exception:
            print('No pop for', Country_Region, iso3)
            pop = 1

        per100k = math.ceil(((float(newval) / float(pop)) * 1000000) * 100)
        tsData[x][iso2][3 + 2] = per100k

# for line in time_series_covid19_recovered_global:
#     s = line.split(',')
#     Province_State = s[0]
#     Country_Region = s[1]
#     Lat = s[2]
#     Long = s[3]
#     for i in range(4, len(s)):
#         # print s[i]
#         tsRecovered[tsDays[4 - i]] = s[i]

# print tsConfirmed

for x in tsData:
    globalConfirmed = 0

    allConfirmed = []
    for iso2 in tsData[x]:
        if iso2 == 'WX' or iso2 == 'WW' or iso2 == 'WY':
            continue
            # print iso2
        v = tsData[x][iso2]
        allConfirmed.append([ v[0], iso2 ])
        globalConfirmed += v[0]
    allConfirmed.sort()
    allConfirmed.reverse()
    tsData[x]['WX'] = allConfirmed[0:20]
    tsData[x]['WW'] = [ globalConfirmed, 0, 0 ]


for x in tsData:
    allDeaths = []
    globalDeaths = 0
    for iso2 in tsData[x]:
        if iso2 == 'WX' or iso2 == 'WW' or iso2 == 'WY':
            continue
            # print iso2
        v = tsData[x][iso2]
        allDeaths.append([ v[1], iso2 ])
        globalDeaths += v[1]
    allDeaths.sort()
    allDeaths.reverse()
    tsData[x]['WY'] = allDeaths[0:20]
    tsData[x]['WW'][1] = globalDeaths

for x in tsData:
    allRecovered = []
    globalRecoveries = 0

    for iso2 in tsData[x]:
        if iso2 == 'WX' or iso2 == 'WW' or iso2 == 'WY':
            continue
            # print iso2
        v = tsData[x][iso2]
        allRecovered.append([ v[2], iso2 ])
        # print iso2, v
        globalRecoveries += v[2]
    allRecovered.sort()
    allRecovered.reverse()
    tsData[x]['WZ'] = allRecovered[0:20]
    tsData[x]['WW'][2] = globalRecoveries

reformatted = []
for day in tsDays:
    dfd = tsData[day]
    reformatted.append(dfd)

with open('../docs/data/global/country-daily.json', 'w') as f:
    # f.write(json.dumps(tsData))
    f.write(json.dumps({ 'daily': reformatted, 'days': tsDays }))

print("[Global] created data")