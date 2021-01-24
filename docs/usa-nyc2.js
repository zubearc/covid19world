// var nycDidLoad = false;
var nycZipPolys = {};
var nycZipData = {};
var nycZipCases = [];
var nycCitywideDailyCases = [];
var nycCitywideData = {};
var nycBoroData = {};
var nycSexData = {};

class NYC {
    constructor() {
        this.didLoad = false;

        this.casesByZipLayer = L.layerGroup();
        this.activeDayIndex = undefined;
        this.barIndex = 0;
        this.barStatsMode = 'cases';
    }

    init(callback) {
        $.getJSON(SERVER_HOST + 'data/usa/nyc-polygons.json', function (data) {
            nycZipPolys = data;
            $.getJSON(SERVER_HOST + 'data/usa/nyc-populations.json', function (data2) {
                nycZipData = data2;
                $.getJSON(SERVER_HOST + 'data/usa/covid19-nyc-zt.json?' + Date.now(), function (data3) {
                    nycZipCases = data3;
                    this.didLoad = true;
                    $.getJSON(SERVER_HOST + 'data/usa/covid19-nyc-daily.json?' + Date.now(), function (data4) {
                        nycCitywideDailyCases = data4.daily;
                        nycCitywideData = data4.totals;
                        nycBoroData = data4.boro;
                        nycSexData = data4.sex;
                        callback();
                    })
                })
            })
        });
    }

    showCovidRatesByZip(dayi, mode) {
        if (dayi == undefined) {
            dayi = nycZipCases.length - 1;
            if (dayi < 0) {
                console.warn('Did not load NYC zip cases yet!');
                alert('Sorry, the data did not load in time. Please refresh the page.');
                return;
            }
        }
        this.activeDayIndex = dayi;

        map.removeLayer(this.casesByZipLayer);
        this.casesByZipLayer = L.layerGroup();

        setTimeout(() => {
            this.bShowZipStats(dayi);
        }, 100);

        // spectrum.reverse();

        for (var nycZip in nycZipPolys) {
            let polys = nycZipPolys[nycZip];

            // let infectedRatio = cases[0] / cases[1];
            // let scaled = infectedRatio * 10;

            let [county, cases, casesColor, infectedRatio, deaths, deathScaled, deathsColor ] = uNYCGetZIPData(dayi, nycZip);

            let color = mode == 'deaths' ? deathsColor : casesColor;

            for (var point of polys) {
                var _poly = L.Polygon.fromEncoded(point, { color: color, fillOpacity: 0.75 });
                //             <p>Infected per 1K: ${infectedRatio} ${Math.round(infectedRatio * 1000)} ${scaled}</p>
                _poly.zip = nycZip;
                _poly.bindTooltip(`
                <b>${nycZip} - ${county.hood}</b> (${county.po}) <br/><br/>
                <b>COVID-19 Cases<br/> Confirmed: </b>${cases[0]}, <b>Total tested: </b>${cases[1]}, <b>Deaths: </b>${deaths}<br/><br/>
                <b>(2010 Census data)</b><br/>
                <b>Population</b>: ${county.pop} (${Math.round(infectedRatio * 100)} per 100 infected, ${Math.round(deathScaled)} per 2500 fatalities)<br/>
                <b>Density</b>: ${county.density} sq/mi<br/>
                `);
                this.casesByZipLayer.addLayer(_poly);
            }
        }

        map.addLayer(this.casesByZipLayer);
    }

    bDrawPanel() {
        
    }

    bShowCitywideStats(dayi) {
        let confirmed = nycCitywideData['cases'];
        let deaths = nycCitywideData['deaths'];
        let possibleDeaths = nycCitywideData['probable'];
        let hosp = nycCitywideData['hosp'];
        if (dayi != undefined) {
            let entry = nycZipCases[dayi][1];
            confirmed = entry[0];
            deaths = entry[1];
            hosp = entry[2];
            possibleDeaths = 0;
        }
        $('#stat-positives').text(numberWithCommas(confirmed));
        $('#stat-deaths').text(numberWithCommas(deaths));
        $('#stat-assumed').text(numberWithCommas(possibleDeaths));
        $('#stat-hosp').text(numberWithCommas(hosp));
    }

    bShowZipStats(dayi, mode) {
        console.log('bShowZipStats', dayi, mode)
        // entry = entry || usaCountiesCases[this.activeDayIndex];
        mode = mode || this.barStatsMode;

        let entry = nycZipCases[dayi][2];

        let sortableCases = [];

        for (var zip in entry) {
            let data = uNYCGetZIPData(dayi, zip);
            let x = mode == 'deaths' ? 2 : 0;
            sortableCases.push([data[1][x], zip, data[0], data[2]]);
        }

        sortableCases.sort((a, b) => {
            return b[0] - a[0]
        });

        let topCCs = sortableCases;

        console.log(topCCs);

        // console.log(entry, entry[4]);

        if (!topCCs) {
            // console.log('!topCCs', topCCs);
            return;
        }

        $('#top-zips').empty();

        console.log('TOPCCs', topCCs);

        for (var topCC of topCCs) {
            let po = topCC[2].po.replace(', NY', '');
            let name = topCC[2].hood;
            if (!['Brooklyn', 'Bronx', 'New York', 'Staten Island'].includes(po)) {
                name = po;
            }
            let col = topCC[3];

            // let col = '#000000';
            $('#top-zips').append(`
            <div onclick='nyc.onPressZIP("${topCC[1]}");' style='background-color: ${col};color: ${invertColor(col, true)};padding: 8px;font-weight: bold;text-align: left;'>
                <span><span style='font-weight:normal;'>${topCC[1]} &dash;</span> ${name} </span>
                <span style='float:right;'>${topCC[0]}</span>
            </div>`)
        }
    }

    onPressZIP(zip) {
        this.casesByZipLayer.eachLayer((layer) => {
            if (layer.zip == zip) {
                map.fitBounds(layer.getBounds());
                map.setZoom(13)
                layer.openTooltip();
            } else {
                layer.closeTooltip();
            }
        })
    }

    onHoverZip(zip) {
        this.casesByZipLayer.eachLayer((layer) => {
            if (layer.zip == zip) {
                layer.openTooltip();
            }
        })
        
    }

    onLoad() {
        $('.leaflet-timeline-control').hide();
        setBackgroundShade('white');

        $.get('component-nyc-panel.html', (data) => {
            $('#info-area').html(data);
            this.bShowCitywideStats();
            nycLoadCharts();
            setTileServer(1);
            map.setView([40.723844, -73.897476], 11);
            this.run();    
        })
    }

    stop() {

    }

    run() {
        $('#back-text').html('&larr; Back to New York State');
        $('#header-text').text('Covid-19 in New York City');
        if (appState[0] == AppStates.US_NYC_Latest) {
            this.showCovidRatesByZip();

            $('#header-date').html(`
            <div style='margin-top: 16px;margin-bottom: 16px; text-align: center;'>
            <span class='g-ct' id='g-timelapse-ds'>${uNYCGetLatestDay()}</span>
            </div>`);
        }
    }

    flush() {
        if (this.casesByZipLayer)
            map.removeLayer(this.casesByZipLayer);


        this.casesByZipLayer = L.layerGroup();
    }


    finish() {
        this.stop();
        this.flush();
        nycZipPolys = {};
        nycZipData = {};
        nycZipCases = [];
        nycCitywideDailyCases = [];
        nycCitywideData = {};
        nycBoroData = {};
        nycSexData = {};
        this.casesByZipLayer = L.layerGroup();

        // Charts
        window.uNYCChartDoD = null;
    }

    onPressBack() {
        this.stop();

        loadFromState(AppStates.US_State_Latest, '36');
    }

    onShowCharts() {
        this.stop();
        $('.barmode').removeClass('g-enabled');
        $('#g-charts').addClass('g-enabled');
        $('#nyc-charts').show();
        $('#nyc-tops').hide();
    }

    onShowTops() {
        this.stop();
        $('.barmode').removeClass('g-enabled');
        $('#g-top-what').addClass('g-enabled');
        $('#nyc-charts').hide();
        $('#nyc-tops').show();
    }

    onSelectStatsMode(mode) {
        this.barStatsMode = mode;
        $('.gcs').prop('class', 'gcs g-disabled');
        $('#gcs-' + mode).prop('class', 'gcs g-enabled');
        // this.bShowZipStats(this.activeDayIndex, mode);
        this.showCovidRatesByZip(null, mode);
    }
}


function uNYCGetZipAtPositition(position, highlight) {
    for (var nycZip in nycZipPolys) {
        let polys = nycZipPolys[nycZip];

        for (var point of polys) {
            var _poly = L.Polygon.fromEncoded(point, { color: 'white' });
            if (L.isPointInsidePolygon({ lat: position[0], lng: position[1] }, _poly)) {

                return [nycZip, _poly];
            }
        }
    }

    return null;
}

function uNYCGetZIPData(dayi, zip) {
    // let spectrum = [ '#ff0000', '#d43f3f', '#a82525', '#ffcc00', '#a87f1d', '#8c853b', '#827a2a', '#615b21', '#544e12', '#636363' ]
    let spectrum = ['#fded86', '#fce36b', '#f7c65d', '#f1a84f', '#ec8c41', '#e76f34', '#e25328', '#b04829', '#7e3e2b', '#4c3430', '#300000'];
    // let spectrum = [ '#f9cdac', '#f2a49f', '#ec7c92', '#e65586', '#bc438b', '#933291', '#692398', '#551c7b', '#41155e', '#2d0f41' ]

    let county = nycZipData[zip];
    let cases = nycZipCases[dayi][2][zip];

    if (!county) {
        return [ { po: 'Unknown' }, cases, '#505050', 1 ];
    }

    let infectedRatio = cases[0] / county.pop;
    // console.log(infectedRatio * 500);
    let scaled = Math.max(0, Math.min(10, Math.round(infectedRatio * 275)));

    // infectedRatio = cases[1];

    let casesColor = spectrum[scaled];
    
    let deaths = cases[2] || 0;
    let deathRatio = deaths / county.pop;
    let deathScaled = Math.max(0, Math.min(10, Math.round(deathRatio * 2500)));
    let deathsColor = spectrum[deathScaled];
    // console.log(deathScaled, deathRatio * 2500, deathRatio, cases[2])

    // console.log(county, cases, scaled, casesColor, infectedRatio)

    return [county, cases, casesColor, infectedRatio, deaths, deathScaled, deathsColor ];
}

function uNYCGetLatestDay() {
    let ds = nycCitywideData.updated;

    if (!ds) {
        return 'Error';
    }

    return ds;

    // NYC gov actually gave proper human dates now! Thx

    // try {
    //     let s = ds.split(',');
    //     let [m, d, y] = s[0].split('/');

    //     let nds = MONTHS[parseInt(m) - 1] + ' ' + parseInt(d);

    //     return nds + ', ' + s[1];
    // } catch (e) {
    //     return ds;
    // }
}