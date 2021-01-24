import os

with open('../coronavirus-data/trends/cases-by-day.csv', 'r') as f:
    cases_lines = f.readlines()

with open('../coronavirus-data/trends/deaths-by-day.csv', 'r') as f:
    deaths_lines = f.readlines()

# print(lines)

out = []

days = {}

for line in cases_lines:
    date_of_interest,CASE_COUNT,PROBABLE_CASE_COUNT,CASE_COUNT_7DAY_AVG,ALL_CASE_COUNT_7DAY_AVG,BX_CASE_COUNT,BX_PROBABLE_CASE_COUNT,BX_CASE_COUNT_7DAY_AVG,BX_ALL_CASE_COUNT_7DAY_AVG,BK_CASE_COUNT,BK_PROBABLE_CASE_COUNT,BK_CASE_COUNT_7DAY_AVG,BK_ALL_CASE_COUNT_7DAY_AVG,MN_CASE_COUNT,MN_PROBABLE_CASE_COUNT,MN_CASE_COUNT_7DAY_AVG,MN_ALL_CASE_COUNT_7DAY_AVG,QN_CASE_COUNT,QN_PROBABLE_CASE_COUNT,QN_CASE_COUNT_7DAY_AVG,QN_ALL_CASE_COUNT_7DAY_AVG,SI_CASE_COUNT,SI_PROBABLE_CASE_COUNT,SI_CASE_COUNT_7DAY_AVG,SI_ALL_CASE_COUNT_7DAY_AVG,INCOMPLETE=line.split(',')
    day = date_of_interest.replace('/','-')
    days[day] = [line]

for line in cases_lines:
    date_of_interest,DEATH_COUNT,PROBABLE_DEATH_COUNT,DEATH_COUNT_7DAY_AVG,ALL_DEATH_COUNT_7DAY_AVG,BX_DEATH_COUNT,BX_PROBABLE_DEATH_COUNT,BX_DEATH_COUNT_7DAY_AVG,BX_ALL_DEATH_COUNT_7DAY_AVG,BK_DEATH_COUNT,BK_PROBABLE_DEATH_COUNT,BK_DEATH_COUNT_7DAY_AVG,BK_ALL_DEATH_COUNT_7DAY_AVG,MN_DEATH_COUNT,MN_PROBABLE_DEATH_COUNT,MN_DEATH_COUNT_7DAY_AVG,MN_ALL_DEATH_COUNT_7DAY_AVG,QN_DEATH_COUNT,QN_PROBABLE_DEATH_COUNT,QN_DEATH_COUNT_7DAY_AVG,QN_ALL_DEATH_COUNT_7DAY_AVG,SI_DEATH_COUNT,SI_PROBABLE_DEATH_COUNT,SI_DEATH_COUNT_7DAY_AVG,SI_ALL_DEATH_COUNT_7DAY_AVG,INCOMPLETE=line.split(',')
    day = date_of_interest.replace('/','-')
    days[day].append(line)

# print days

for day in days:
    # print(day)
    cases,deaths = days[day]
    # print cases,days[day]
    date_of_interest,CASE_COUNT,PROBABLE_CASE_COUNT,CASE_COUNT_7DAY_AVG,ALL_CASE_COUNT_7DAY_AVG,BX_CASE_COUNT,BX_PROBABLE_CASE_COUNT,BX_CASE_COUNT_7DAY_AVG,BX_ALL_CASE_COUNT_7DAY_AVG,BK_CASE_COUNT,BK_PROBABLE_CASE_COUNT,BK_CASE_COUNT_7DAY_AVG,BK_ALL_CASE_COUNT_7DAY_AVG,MN_CASE_COUNT,MN_PROBABLE_CASE_COUNT,MN_CASE_COUNT_7DAY_AVG,MN_ALL_CASE_COUNT_7DAY_AVG,QN_CASE_COUNT,QN_PROBABLE_CASE_COUNT,QN_CASE_COUNT_7DAY_AVG,QN_ALL_CASE_COUNT_7DAY_AVG,SI_CASE_COUNT,SI_PROBABLE_CASE_COUNT,SI_CASE_COUNT_7DAY_AVG,SI_ALL_CASE_COUNT_7DAY_AVG,INCOMPLETE=cases.split(',')
    date_of_interest,DEATH_COUNT,PROBABLE_DEATH_COUNT,DEATH_COUNT_7DAY_AVG,ALL_DEATH_COUNT_7DAY_AVG,BX_DEATH_COUNT,BX_PROBABLE_DEATH_COUNT,BX_DEATH_COUNT_7DAY_AVG,BX_ALL_DEATH_COUNT_7DAY_AVG,BK_DEATH_COUNT,BK_PROBABLE_DEATH_COUNT,BK_DEATH_COUNT_7DAY_AVG,BK_ALL_DEATH_COUNT_7DAY_AVG,MN_DEATH_COUNT,MN_PROBABLE_DEATH_COUNT,MN_DEATH_COUNT_7DAY_AVG,MN_ALL_DEATH_COUNT_7DAY_AVG,QN_DEATH_COUNT,QN_PROBABLE_DEATH_COUNT,QN_DEATH_COUNT_7DAY_AVG,QN_ALL_DEATH_COUNT_7DAY_AVG,SI_DEATH_COUNT,SI_PROBABLE_DEATH_COUNT,SI_DEATH_COUNT_7DAY_AVG,SI_ALL_DEATH_COUNT_7DAY_AVG,INCOMPLETE=deaths.split(',')

    out.append([day, 'Bronx', 'New York', '36005', BX_CASE_COUNT, BX_DEATH_COUNT])
    out.append([day, 'Brooklyn', 'New York', '36047', BK_CASE_COUNT, BK_DEATH_COUNT])
    out.append([day, 'Manhattan', 'New York', '36061', MN_CASE_COUNT, MN_DEATH_COUNT])
    out.append([day, 'Queens', 'New York', '36081', QN_CASE_COUNT, QN_DEATH_COUNT])
    out.append([day, 'Staten Island', 'New York', '36085', SI_CASE_COUNT, SI_DEATH_COUNT])

s = ''
for o in out:
    # print o
    s += ','.join(o) + '\n'

with open('../USA-Counties-NYT-Extra.csv', 'w') as f:
    f.write(s)

print("Fixed NYC NYTimes data!")