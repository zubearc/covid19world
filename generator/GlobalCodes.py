import csv, json

countryNameToIso2 = {}
countryNameToIso3 = {}
Iso3toIso2 = {}
Iso2ToName = {}
# YD= Diamond Princess, 3K people onboard estimate
# all other pops from worldometers.info estimates (from UN) or CIA projections
countryPopulationsIso3 = {'TWN': 23806748, 'NLD': 17126049, 'BES': 25157, 'MSR': 5900, 'AIA': 15094, 'MTQ': 376480,
                          'YD': 3000, 'YE': 1200,
                          'ERI': 3534851, 'VAT': 618, 'XKS': 1932774, 'GUF': 290691, 'GLP': 395700, 'MYT': 270372, 'REU': 859959, 'BLM': 9131 }

with open('COVID-19/csse_covid_19_data/UID_ISO_FIPS_LookUp_Table.csv', 'r') as f:
    UID_ISO_FIPS_LookUp_Table = f.readlines()

UID_ISO_FIPS_LookUp_Table.pop(0)
# csv.reader is used to read a file
reader = csv.reader(UID_ISO_FIPS_LookUp_Table)
first = True
for row in reader:
    UID, iso2, iso3, code3, FIPS, Admin2, Province_State, Country_Region, Lat, Long_, Combined_Key, pop = row

    # UPDATE: Fixed this properly!  
    # Fix China Special Administrative Regions (SAR) into their own psuedo-countries
    # if Country_Region == 'China' and Province_State == 'Hong Kong':
    #     Country_Region = 'Hong Kong'
    # if Country_Region == 'China' and Province_State == 'Macau':
    #     Country_Region = 'Macau'
    # if Country_Region == 'France':
    #     continue

        # print row, iso2, iso3
    name = Province_State + ',' + Country_Region
    countryNameToIso2[name] = iso2
    countryNameToIso3[name] = iso3
    Iso3toIso2[iso3] = iso2
    Iso2ToName[iso2] = name
    countryPopulationsIso3[iso3] = pop
    # print Country_Region, iso3, len(countyNameToIso3.keys())

countryNameToIso3[',Diamond Princess'] = 'YD'
countryNameToIso3[',MS Zaandam'] = 'YE'

# print countryNameToIso2

with open('global/global-country-code-map.tsv', 'r') as f:
    lines = f.readlines()
    for line in lines:
        _name,iso2,iso3,num = line.strip().split('\t')
        # if name =='China':
        #     print line
        #     print countryNameToIso2['China']
        if _name not in countryNameToIso2:
            try:
                name, _t = _name.replace(')', '').split('(')
                name = name.strip()
            except Exception:
                name = _name
            countryNameToIso2[name] = iso2
            countryNameToIso3[name] = iso3
            Iso3toIso2[iso3] = iso2
            if '(' in name:
                # print name
                _namef = _t.title() + ' ' + name
                Iso2ToName[iso2] = _namef
            else:
                Iso2ToName[iso2] = name
# print countryNameToIso2
with open('global/global-population-worldbank.csv', 'r') as f:
    lines = f.readlines()
    lines.pop(0)
    reader=csv.reader(lines)       #csv.reader is used to read a file
    first = True
    for row in reader:
        # "Country Name","Country Code","1960","1961","1962","1963","1964","1965","1966","1967","1968","1969","1970","1971","1972","1973","1974","1975","1976","1977","1978","1979","1980","1981","1982","1983","1984","1985","1986","1987","1988","1989","1990","1991","1992","1993","1994","1995","1996","1997","1998","1999","2000","2001","2002","2003","2004","2005","2006","2007","2008","2009","2010","2011","2012","2013","2014","2015","2016","2017","2018","2019",
        iso3 = row[1]
        pop18 = row[len(row) - 3]
        # print row[len(row) - 3]
        if pop18:
            countryPopulationsIso3[iso3] = pop18
        # countyNameToIso2[Country_Region] = iso2

# print countryNameToIso3
# print countryPopulationsIso3

# print Iso3toIso2

# assert countryNameToIso2['China'] == 'CN'

# print(json.dumps(Iso2ToName))

iso2p = {}
for iso3cc in countryPopulationsIso3:
    try:
        d = countryPopulationsIso3[iso3cc]
        print d
        iso2 = Iso3toIso2[iso3cc]
        iso2p[iso2] = int(d)
    except Exception:
        print 'fail', iso3cc

# print(json.dumps(iso2p))