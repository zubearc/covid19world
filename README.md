## COVID-19 Timeline

The purpose of this project is to build a consolidated global map and timeline for data on the spread of COVID-19. It is based off of existing data from John Hopkins University for global data, the New York Times for United States data, and the New York City Department of Health for New York City-local data. If the time constraints permit, we may be able to add other major cities in the United States.

TODO:
* Setup Github CI & data updating script
* Add more nyc data
* Commit initial leaflet web app work (@Dragon)

### Build

* You *must* clone with `git clone --recursive https://github.com/zubearc/covid19world.git`. If you didn't clone with recursive (or are using GitPod), run `git submodule init && git submodule update`. This is required to install the submodules.
* To update the data, `cd generator && python3 update.py` - stuck? see the CI steps for more info

### Misc

Disclaimers:
* The map polygon data is from Wikipedia and the John Hopkins data parser was based off of existing code. For this project, we will expand on this data parser to work with US data and if time permits, New York City data.
* The authors make no claims toward the validity or completeness of the data. 

Sources:
* https://github.com/CSSEGISandData/COVID-19 - (generator/COVID-19)
* https://github.com/nychealth/coronavirus-data - (generator/coronavirus-data)
* https://github.com/nytimes/covid-19-data - (generator/covid-19-data)
* https://github.com/datasets/population - world population data (generator/global)
* https://gist.github.com/signed0/2031157 - (generator/Polylines.py)
* https://gist.github.com/zubearc/ef821948a47f8637de858b1ac6dff777 - jhu transformer (generator/CreateGlobalCovidData)
* Wikipedia - geojson polygons - (docs/data/usa/counties,states.json)

Open in GitPod: https://gitpod.io/#https://github.com/zubearc/covid19world