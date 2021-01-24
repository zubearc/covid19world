var usaStateBbs = {};
var usaStatePolys = {};
var usaStateCounties = {};
var usaCounties = {};
var usaCountiesCases = [];
var US_STATE_NAMES = { "01": "Alabama", "02": "Alaska", "04": "Arizona", "05": "Arkansas", "06": "California", "08": "Colorado", "09": "Connecticut", "10": "Delaware", "11": "District of Columbia", "12": "Florida", "13": "Geogia", "15": "Hawaii", "16": "Idaho", "17": "Illinois", "18": "Indiana", "19": "Iowa", "20": "Kansas", "21": "Kentucky", "22": "Louisiana", "23": "Maine", "24": "Maryland", "25": "Massachusetts", "26": "Michigan", "27": "Minnesota", "28": "Mississippi", "29": "Missouri", "30": "Montana", "31": "Nebraska", "32": "Nevada", "33": "New Hampshire", "34": "New Jersey", "35": "New Mexico", "36": "New York", "37": "North Carolina", "38": "North Dakota", "39": "Ohio", "40": "Oklahoma", "41": "Oregon", "42": "Pennsylvania", "44": "Rhode Island", "45": "South Carolina", "46": "South Dakota", "47": "Tennessee", "48": "Texas", "49": "Utah", "50": "Vermont", "51": "Virginia", "53": "Washington", "54": "West Virginia", "55": "Wisconsin", "56": "Wyoming" };

var usaDidLoad = false;
var usaSelectedState = null;

class USA {
    constructor() {
        this.didLoad = false;

        this.drawnStateLGs = {};
        this.drawnCountiesLGs = {};

        this.activeDayIndex = null;

        this.barStatsMode = 'cases';

        this.countyCache = {};
        this.statesHidden = [];
        this.renderer = myRenderer;//L.canvas({ padding: 0.5 });
    }

    init(callback) {
        $('#loading-warning').show();
        $.getJSON(SERVER_HOST + 'data/usa/states.json', function (data) {
            for (var fs in data.bbs) {
                let bb = data.bbs[fs];
                usaStateBbs[fs] = L.latLngBounds(bb);
            }
            usaStatePolys = data.polys;
            usaStateCounties = data.fcs;
            // console.warn(data);
            $.getJSON(SERVER_HOST + 'data/usa/counties.json', function (data2) {
                usaCounties = data2;
                // usaDidLoad = true;
                $.getJSON(SERVER_HOST + 'data/usa/covid19-states-daily.json?' + Date.now(), function (data) {
                    usaCountiesCases = data;
                    this.didLoad = true;
                    $('#loading-warning').hide();
                    callback();
                });
            })
        })
    }

    onLoad() {
        $.get('component-usa-panel.html?' + appHash, (data) => {
            $('#info-area').html(data);
            this.run();
        })
    }

    bShowCaseStats(entry) {
        let cw = entry[3];
        $('#stat-positives').text(numberWithCommas(cw[0]));
        $('#stat-deaths').text(numberWithCommas(cw[1]));
        $('#stat-recoveries').text(numberWithCommas(cw[2]));
    }

    bShowCountryStats(entry, mode) {
        entry = entry || usaCountiesCases[this.activeDayIndex];
        mode = mode || this.barStatsMode;

        let topCCs = entry[4][mode == 'cases' ? 0 : (mode == 'deaths' ? 1 : '-1')];

        // console.log(entry, entry[4]);

        if (!topCCs) {
            // console.log('!topCCs', topCCs);
            return;
        }

        $('#top-countries').empty();

        for (var topCC of topCCs) {
            let name = US_STATE_NAMES[topCC[1]];
            let color = uGetStateCases(topCC[1], this.activeDayIndex);
            let col = color[2];
            // let col = '#000000';
            $('#top-countries').append(`
            <div onclick='usa.onPressState("${topCC[1]}");' style='background-color: ${col};color: ${invertColor(col, true)};padding: 8px;font-weight: bold;text-align: left;'>
                <span>${name}</span>
                <span style='float:right;'>${topCC[0]}</span>
            </div>`)
        }
    }

    bShowStateCaseStats(statefc) {
        if (!statefc) {
            $('#stat-positives').text(0);
            $('#stat-deaths').text(0);
            $('#stat-recoveries').text('...');
            return;
        }
        let cw = uGetStateCases(statefc, this.activeDayIndex);
        $('#stat-positives').text(numberWithCommas(cw[4]));
        $('#stat-deaths').text(numberWithCommas(cw[5]));
        $('#stat-recoveries').text('...');
    }

    _buildStateStats(statefc) {

        let data = usaCountiesCases[this.activeDayIndex];
        let countyEntries = data[2];

        let sortableCases = [];
        let sortableDeaths = [];

        for (var sfc of usaStateCounties[statefc]) {
            // fcs.push(sfc);
            let e = countyEntries[sfc];
            if (!e) {
                continue;
            }
            sortableCases.push([e[1], sfc]);
            sortableDeaths.push([e[2], sfc]);
        }

        sortableCases.sort((a, b) => {
            return b[0] - a[0]
        });
        sortableDeaths.sort((a, b) => {
            return b[0] - a[0]
        });

        console.log(sortableCases, sortableDeaths);

        this.cachedStateStats = [this.activeDayIndex, sortableCases, sortableDeaths];
    }

    bShowStateStats(statefc, mode) {
        mode = mode || this.barStatsMode;

        if (!this.cachedStateStats || this.cacheAllCounties[0] != this.activeDayIndex) {
            this._buildStateStats(statefc);
            // console.warn('Generated state stats');
        }

        let topCCs = this.cachedStateStats[mode == 'cases' ? 1 : (mode == 'deaths' ? 2 : -1)];

        // console.log(entry, entry[4]);

        if (!topCCs) {
            // console.log('!topCCs', topCCs);
            return;
        }

        $('#top-countries').empty();

        for (var topCC of topCCs) {
            let c = usaCounties[topCC[1]];
            if (!c) {
                continue;
            }

            let name = c.n;
            let color = uGetCountyCases(topCC[1], this.activeDayIndex);
            let col = color[1];
            let onclick = '';

            if (name.includes('NYC')) {
                onclick = `usa.onPressLocality('NYC')`;
            }

            $('#top-countries').append(`
            <div ${onclick ? `onclick="${onclick}"` : ''} style='background-color: ${col};color: ${invertColor(col, true)};padding: 8px;font-weight: bold;text-align: left;'>
                <span>${name}</span>
                <span style='float:right;'>${topCC[0]}</span>
            </div>`)
        }
    }

    showStateDayByDayAnimation(statefc, shouldRepeat) {
        let data = usaCountiesCases;
        this.activeDayIndex = 0;

        let lastShown = [];

        // $('#top-countries').text('CACHING EVERTHING...');
        this.bShowStateCaseStats(null);

        var work = () => {
            let entry = data[this.activeDayIndex];

            if (!entry) {
                this.activeDayIndex--;
                if (shouldRepeat) {
                    this.activeDayIndex = 0;
                    this._flush();
                } else {
                    return false;
                }
                return true;
            }

            let day = entry[0];

            let ds = uGetReadableDate(day);
            $('.g-ct').text(ds);
            // $('#displayed-list').text(day);
            // console.log(entry.WW)

            this.bShowStateCaseStats(statefc);

            this.bShowStateStats(statefc, this.barStatsMode);

            // gFlushMap(lastShown);
            // TODO: Don't flush & simply update existing on-screen elements!
            // this.flushCountiesExcept([]);

            // this.showCountryState(this.activeDayIndex);
            this.showStateCounties(this.activeDayIndex, statefc);

            this.activeDayIndex++;
            // console.log(i);
            return true;
        }

        var lastLoopTime = Date.now();

        var loop = () => {
            L.Util.cancelAnimFrame(window.gAnimFrame);
            window.gAnimFrame = L.Util.requestAnimFrame(() => {
                let shouldContinue = work();
                if (shouldContinue)
                    setTimeout(() => {
                        if (this.animationFrameCancelled) {
                            return;
                        }
                        loop();
                    }, 500);
                else {
                    this.stop();
                }
            });
        }

        this.animationFrameCancelled = false;

        $('#loading-warning').show();
        // Give time for Dom to update before caching so we don't freeze before warning shows
        setTimeout(() => {
            // this.cacheAllCounties();
            $('#loading-warning').hide();
            loop();
        }, 250);
    }

    showDayByDayAnimation(showLatest, shouldRepeat) {

        if (showLatest) {
            this.showCountryLatest(null);
            return;
        }

        let data = usaCountiesCases;
        this.activeDayIndex = 0;

        let lastShown = [];

        // $('#top-countries').text('CACHING EVERTHING...');

        var work = () => {
            let entry = data[this.activeDayIndex];

            if (!entry) {
                this.activeDayIndex--;
                if (shouldRepeat) {
                    this.activeDayIndex = 0;
                    this._flush();
                } else {
                    return false;
                }
                return true;
            }

            let day = entry[0];

            let ds = uGetReadableDate(day);
            $('.g-ct').text(ds);
            // $('#displayed-list').text(day);
            // console.log(entry.WW)

            this.bShowCaseStats(entry);

            this.bShowCountryStats(entry, this.barStatsMode);

            // gFlushMap(lastShown);
            // TODO: Don't flush & simply update existing on-screen elements!
            // this.flushCountiesExcept([]);

            // this.showCountryState(this.activeDayIndex);
            this.showCountyState(this.activeDayIndex);

            this.activeDayIndex++;
            // console.log(i);
            return true;
        }

        var lastLoopTime = Date.now();

        var loop = () => {
            L.Util.cancelAnimFrame(window.gAnimFrame);
            window.gAnimFrame = L.Util.requestAnimFrame(() => {
                let shouldContinue = work();
                if (shouldContinue)
                    setTimeout(() => {
                        if (this.animationFrameCancelled) {
                            return;
                        }
                        loop();
                    }, 500);
                else {
                    this.stop();
                }
            });
        }

        this.animationFrameCancelled = false;

        $('#loading-warning').show();
        // Give time for Dom to update before caching so we don't freeze before warning shows
        setTimeout(() => {
            if (!_isMobile) {
                this.cacheAllCounties();
            }
            $('#loading-warning').hide();
            loop();
        }, 250);
    }

    showCountryLatest(mode) {
        mode = mode || 'state';
        // let day = entry[0];
        // $('#displayed-list').text(day);
        // let info = entry[1];

        // for (var statefc in usaStatePolys) {
        //     if (info[statefc]) {
        //         this.drawState(statefc, info[statefc][0]);
        //     }
        // }

        this.activeDayIndex = usaCountiesCases.length - 1;
        let entry = usaCountiesCases[this.activeDayIndex];
        // showEntry(data[data.length - 1]);

        this.bShowCaseStats(entry);

        this.bShowCountryStats(entry, this.barStatsMode);

        if (mode == 'state') {
            this.showCountryState(this.activeDayIndex);
        } else if (mode == 'county') {
            this.showCountyState(this.activeDayIndex);
        }
    }

    showStateLatest(stateCode) {
        let bb = usaStateBbs[stateCode];
        map.fitBounds(bb);
        this.activeDayIndex = usaCountiesCases.length - 1;
        this.showStateCounties(this.activeDayIndex, stateCode);

        this.bShowStateCaseStats(stateCode);
        this.bShowStateStats(stateCode);
    }

    showCountryState(dayi) {
        let data = usaCountiesCases;
        let entry = data[dayi];
        if (!entry) {
            console.warn('Invalid day index', dayi);
            return;
        }

        let day = entry[0];
        $('#displayed-list').text(day);
        let info = entry[1];
        // stateColors = colors;


        for (var statefc in usaStatePolys) {
            if (info[statefc]) {
                let c = uGetStateCases(statefc, dayi);
                this.drawState(statefc, c[2]);
                // let nfo = info[statefc][1];
                // if (nfo[0] && showBoxes)
                //     uShowStateCasesBox(statefc, stateNames[statefc], nfo[0]);
            }
        }
    }

    showCountyState(dayi) {
        let data = usaCountiesCases;
        let entry = data[dayi];
        if (!entry) {
            console.warn('Invalid day index', dayi);
            return;
        }

        let day = entry[0];
        $('#displayed-list').text(day);
        let info = entry[2];
        // stateColors = colors;

        for (var fc in info) {
            if (!fc) {
                continue;
            }
            let stateCode = fc.slice(0, 2);

            // this.drawCountyToGeoJson(stateCode, fc, gj);
            this.drawCounty(stateCode, fc);
        }
        return;
    }

    showStateCounties(dayi, statefc) {
        let data = usaCountiesCases;
        let entry = data[dayi];
        if (!entry) {
            console.warn('Invalid day index', dayi);
            return;
        }

        let day = entry[0];
        $('#displayed-list').text(day);
        let info = entry[2];
        // stateColors = colors;

        for (var fc in info) {
            if (!fc) {
                continue;
            }
            let stateCode = fc.slice(0, 2);
            if (stateCode == statefc) {
                this.drawCounty(stateCode, fc);
            }
        }
        return;

    }

    hideStatesExcept(except) {

    }

    flushStatesExcept(except) {
        except = except || [];
        for (var c in this.drawnStateLGs) {
            if (except.includes(c)) {
                continue;
            }
            if (this.drawnStateLGs[c]) {
                map.removeLayer(this.drawnStateLGs[c]);
                delete this.drawnStateLGs[c];
            }
        }
        this.drawnStateLGs = {};
    }

    flushCountiesExcept(except) {
        except = except || [];
        for (var c in this.drawnCountiesLGs) {
            if (except.includes(c)) {
                continue;
            }
            if (this.drawnCountiesLGs[c]) {
                map.removeLayer(this.drawnCountiesLGs[c]);
                delete this.drawnCountiesLGs[c];
            }
        }
        this.drawnCountiesLGs = {};
    }

    drawCounty(statefc, countyFc) {
        if (countyFc == 46102) {
            countyFc = 46113;
        }
        if (this.drawnCountiesLGs[statefc] == null) {
            this.drawnCountiesLGs[statefc] = L.layerGroup();
        } else {
            let county = usaCounties[countyFc];
            let casesAndColor = uGetCountyCases(countyFc, this.activeDayIndex);
            let color = casesAndColor[1];
            let pm = Math.round((county.m / (county.m + county.f)) * 100);
            let pf = Math.round((county.f / (county.m + county.f)) * 100);

            let found = false;

            this.drawnCountiesLGs[statefc].eachLayer((layer) => {
                if (layer.fips == countyFc) {
                    layer.setStyle({ color: color })
                    layer.bindTooltip(`
                        <b>${county.n}</b> (${countyFc}) <br/><br/>
                        <b>COVID-19 Cases<br/> Active: </b>${casesAndColor[2]}, <b>Recovered: </b>${casesAndColor[4]}, <b>Deaths:</b> <span class='sd'>${casesAndColor[3]}</span><br/><br/>
                        <b>(2010 Census data)</b><br/>

                        <b>Population</b>: ${numberWithCommas(county.pop12)} (${casesAndColor[0]} per 10,000 infected)<br/>
                        ${pm}% Male, ${pf}% Female <br/>
                        <!--<b>Age</b>: 1-19 (18%), 20-35 (), 35-64 (22%), 65+ () <br/>-->
                        `);
                    found = true;
                }
            })

            if (found) {
                // Already drew, no need to decode & re-draw. Updated existing.
                return;
            }
        }

        this._drawCounty(statefc, countyFc);

        map.addLayer(this.drawnCountiesLGs[statefc]);
    }

    cacheAllCounties() {
        for (var countyFc in usaCounties) {
            if (parseInt(countyFc) % 2 == 0) continue;
            let county = usaCounties[countyFc];
            let polys = county.polys;
            for (var point of polys) {
                let decoded = L.PolylineUtil.decode(point);
                if (!this.countyCache[countyFc]) {
                    this.countyCache[countyFc] = [decoded];
                } else {
                    this.countyCache[countyFc].push(decoded);
                }
            }
        }
    }

    _drawCounty(statefc, countyFc) {
        if (countyFc == 46102) {
            countyFc = 46113;
        }
        let county = usaCounties[countyFc];
        let hasCached = this.countyCache[countyFc];
        let polys = hasCached ? hasCached : county.polys;
        // console.log('Has chached!');
        // throw 'done';
        let sticky = appState[0] != AppStates.US_State_Latest;
        sticky = false;
        let casesAndColor = uGetCountyCases(countyFc, this.activeDayIndex);
        let color = casesAndColor[1];
        let pm = Math.round((county.m / (county.m + county.f)) * 100);
        let pf = Math.round((county.f / (county.m + county.f)) * 100);

        for (var point of polys) {
            if (hasCached) {
                var _poly = L.polygon(point, {
                    renderer: myRenderer,
                    color: /*countyColorMap ? countyColorMap[countyFc] : 'white'*/color,
                    fillOpacity: sticky ? 1 : 0.50,
                    // fillOpacity: 0.75,
                    weight: sticky ? 0 : 1
                });
            } else {
                var _poly = L.Polygon.fromEncoded(point, {
                    renderer: myRenderer,
                    color: /*countyColorMap ? countyColorMap[countyFc] : 'white'*/color,
                    fillOpacity: sticky ? 1 : 0.50,
                    // fillOpacity: 0.75,
                    weight: sticky ? 0 : 1
                });
            }
            _poly.fips = countyFc;
            // _poly.addTo(map);
            _poly.bindTooltip(`
                <b>${county.n}</b> (${countyFc}) <br/><br/>
                <b>COVID-19 Cases<br/> Active: </b>${casesAndColor[2]}, <b>Recovered: </b>${casesAndColor[4]}, <b>Deaths:</b> <span class='sd'>${casesAndColor[3]}</span><br/><br/>
                <b>(2010 Census data)</b><br/>
                <b>Population</b>: ${numberWithCommas(county.pop12)} (${casesAndColor[0]} per 10,000 infected)<br/>
                ${pm}% Male, ${pf}% Female<br/>
                <!--<b>Age</b>: 1-19 (18%), 20-35 (), 35-64 (22%), 65+ () <br/>-->
                `);
            if (['36005', '36061', '36081', '36047', '36085'].includes(countyFc)) {
                _poly.on('click', () => {
                    this.onPressLocality('NYC');
                })
            }
            this.drawnCountiesLGs[statefc].addLayer(_poly);
        }

        if (this.countyCache[countyFc]) {
            // Free some memory now that we are done
            delete this.countyCache[countyFc];
        }
    }


    // webgl renderer is *much* faster than canvas & 100000x faster than SVG rendering
    // nvm
    /*drawCountyToGeoJson(statefc, countyFc, gj) {
        let county = usaCounties[countyFc];
        let hasCached = this.countyCache[countyFc];
        let polys = hasCached ? hasCached : county.polys;
        // console.log('Has chached!');
        // throw 'done';
        let sticky = true;
        let casesAndColor = uGetCountyCases(countyFc, this.activeDayIndex);

        let pm = Math.round((county.m / (county.m + county.f)) * 100);
        let pf = Math.round((county.f / (county.m + county.f)) * 100);



        for (var point of polys) {
            if (hasCached) {
                let points = point;
                gj.features.push({
                    "type": "Feature",
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": points
                    }
                })
            } else {
                let points = L.PolylineUtil.decode(point);
                gj.features.push({
                    "type": "Feature",
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": points
                    }
                })
            }
        }

        if (this.countyCache[countyFc]) {
            // Free some memory now that we are done
            delete this.countyCache[countyFc];
        }
    }*/

    drawCounties(statefc, countyColorMap, sticky) {
        let countiesFc = usaStateCounties[statefc];

        if (this.drawnCountiesLGs[statefc]) {
            map.removeLayer(this.drawnCountiesLGs[statefc]);
            this.drawnCountiesLGs[statefc] = L.layerGroup();
        } else {
            this.drawnCountiesLGs[statefc] = L.layerGroup();
        }

        for (var countyFc of countiesFc) {
            this._drawCounty(countryFc);
        }

        map.addLayer(this.drawnCountiesLGs[statefc]);
    }

    drawState(statefc, color) {
        // console.warn('uDrawState', statefc, color);
        if (color == 'white') color = 'black';
        let polys = usaStatePolys[statefc];

        if (this.drawnStateLGs[statefc]) {
            map.removeLayer(this.drawnStateLGs[statefc]);
            this.drawnStateLGs[statefc] = L.layerGroup();
        } else {
            this.drawnStateLGs[statefc] = L.layerGroup();
        }

        let casesAndColor = uGetStateCases(statefc, this.activeDayIndex);
        let str = '';

        if (casesAndColor) {
            let [cases_per_100k, deaths_per_100k, color, deathcolor, cases, deaths] = casesAndColor;
            str += `<br/>
            <br/><b>COVID-19 Data</b><br/>
            <b>Cases:</b> ${numberWithCommas(cases)} - <b>Deaths: </b> <span style='color:red'>${deaths}</span><br/><br/>
            <span style='color:purple'>${cases_per_100k}</span> positive tests per 100,000 <br/>
            <span style='color:red'>${deaths_per_100k}</span> deaths per 100,000 `;
        }

        // ;


        for (var poly of polys) {
            let gon = L.Polygon.fromEncoded(poly, { renderer: myRenderer, color: color, weight: 0.75, fillOpacity: 0.75 });
            gon.bindTooltip(`
                    <b>${US_STATE_NAMES[statefc]} </b> (${statefc})
                    ${str}
                    `);

            gon.on('click', () => {
                this.onPressState(statefc);
            })

            this.drawnStateLGs[statefc].addLayer(gon);

            // gon.addTo(map);
        }
        map.addLayer(this.drawnStateLGs[statefc]);
    }

    onPressState(statefc) {
        setAppState(AppStates.US_State_Latest, statefc);
        this.run();
    }

    onPressLocality(city) {
        if (city == 'NYC') {
            loadFromState(AppStates.US_NYC_Latest);
            // appState = [ AppStates.US_NYC_Latest ];
            // this.run()
        }
    }

    _flush() {
        this.cachedStateStats = null;
        this.countyCache = {};
        this.flushStatesExcept([]);
        this.flushCountiesExcept([]);
    }

    run() {
        this.stop();
        this._flush();
        console.warn(appState[0])
        let bounds = [[50.176898, -127.353516], [24.607069, -65.566406]];

        // let latestDataDay = usaCountiesCases[usaCountiesCases.length];

        if (appState[0] == AppStates.US_Latest) {
            $('#g-top-what').text('Top states');
            $('#header-text').text('Covid-19 in the United States');
            $('#back-text').html('&larr; Back to worldwide')
            $('#header-date').html(`
            <div style='margin-top: 16px;margin-bottom: 16px; text-align: center;display: flex;justify-content: space-between;align-items:center;'>
            <span>
                <span class='g-btn' onclick='usa.onPressPlayLapse()'>▶ Play
                    timelapse</span>
                <span class='g-btn' id='viewing-mode' style='color:#a0a0a0;cursor:pointer' onclick='usa.onToggleLatestCountyStateView()'>🔀</span>
            </span>
            <span class='g-ct' id='g-timelapse-ds'>${uGetLatestDay()}</span>
            </div>`);

            setBackgroundShade('black');

            map.fitBounds(bounds);

            mapEnable();

            let cm = appState[1] || 'state';
            if (cm == 'state') {
                // mapEnable();
                $('.scale').hide();
                $('#usa-scale-country').show();
            } else {
                // mapDisable();
                $('.scale').hide();
                $('#usa-scale-counties').show();
            }
            this.showCountryLatest(cm);

        } else if (appState[0] == AppStates.US_Timelapse) {
            // console.warn('good')
            $('#g-top-what').text('Top states');
            $('#header-text').text('Covid-19 in the United States');
            $('#back-text').html('&larr; Back to worldwide')
            $('#header-date').html(`
            <div style='margin-top: 16px;margin-bottom: 16px; text-align: center;display: flex;justify-content: space-between;'>
            <span>
                <span class='g-btn' onclick='usa.onPressExitLapse()'>
                    &larr; Exit timelapse
                </span>
                <span class='g-btn' style='margin-left:8px;' onclick='usa.onPressRepeatLapse()'>🔁</span>    
            </span>

            <span class='g-ct' id='g-timelapse-ds'>Loading...</span>
            </div>`);
            setBackgroundShade('black');

            $('.scale').hide();
            $('#usa-scale-counties').show();

            map.fitBounds(bounds);
            mapDisable();
            this.showDayByDayAnimation();
        } else if (appState[0] == AppStates.US_State_Latest) {
            $('#back-text').html('&larr; Back to the United States')
            $('#g-top-what').text('Top counties');
            setTileServer(11);
            mapEnable();
            // appState[1] = '36';
            let stateCode = appState[1];
            $('#header-text').text('Covid-19 in ' + US_STATE_NAMES[stateCode]);

            setBackgroundShade('blue');

            $('#header-date').html(`
            <div style='margin-top: 16px;margin-bottom: 16px; text-align: center;display: flex;justify-content: space-between;'>
            <span>
                <span class='g-btn' onclick='usa.onPressPlayStateLapse()'>▶ Play
                    timelapse</span>
            </span>
            <span class='g-ct' id='g-timelapse-ds'>${uGetLatestDay()}</span>
            </div>`);

            $('.scale').hide();
            $('#usa-scale-counties').show();

            this.showStateLatest(stateCode);
        } else if (appState[0] == AppStates.US_State_Timelapse) {
            $('#back-text').html('&larr; Back to the United States')
            $('#g-top-what').text('Top counties');
            setTileServer(11);
            mapEnable();
            // appState[1] = '36';
            let stateCode = appState[1];
            $('#header-text').text('Covid-19 in ' + US_STATE_NAMES[stateCode]);
            setBackgroundShade('blue');

            $('#header-date').html(`
            <div style='margin-top: 16px;margin-bottom: 16px; text-align: center;display: flex;justify-content: space-between;'>
            <span>
                <span class='g-btn' onclick='usa.onPressExitStateLapse()'>
                    &larr; Exit timelapse
                </span>
                <span class='g-btn' style='margin-left:8px;' onclick='usa.onPressRepeatStateLapse()'>🔁</span>    
            </span>

            <span class='g-ct' id='g-timelapse-ds'>Loading...</span>
            </div>`);

            $('.scale').hide();
            $('#usa-scale-counties').show();

            this.showStateDayByDayAnimation(stateCode);
            let bb = usaStateBbs[stateCode];
            map.fitBounds(bb);
        }
    }

    stop() {
        L.Util.cancelAnimFrame(this.animationFrame);
        this.animationFrame = null;
        this.animationFrameCancelled = true;
    }

    finish() {
        this.stop();
        this._flush();
        usaStatePolys = {};
        usaStateCounties = {};
        usaCounties = {};
        usaDidLoad = false;
        usaCountiesCases = [];
    }

    // Event Handlers
    onSelectStatsMode(mode) {
        this.barStatsMode = mode;
        $('.gcs').prop('class', 'gcs g-disabled');
        $('#gcs-' + mode).prop('class', 'gcs g-enabled');
        if (appState[0] == AppStates.US_State_Latest || appState[0] == AppStates.US_State_Timelapse) {
            this.bShowStateStats(appState[1]);
        } else {
            this.bShowCountryStats();
        }
    }

    onMapMove(position) {

        if (appState[0] == AppStates.US_Latest) {
            let state = uGetStatesAtPosition([position.lat, position.lng]); // Sometimes ambig, so we return array
            // console.log('States: ' , state);
            let drew = false
            if (state.length) {
                for (var stat of state) {
                    let county = uGetCountyAtPosition(stat, [position.lat, position.lng]);
                    if (county) {
                        this.drawCounties(stat);
                        drew = stat;
                    }
                }
            }
            // console.log('mousemove', state, drew);
            // for (var hiddenState of this.statesHidden) {
            //     // map.addLayer(u_HighlitedStatesLayerSuperGroup[hiddenState]);
            // }
            // this.statesHidden = [];
            // if (!drew) {
            //     map.removeLayer(u_HighlitedStateLayerGroup);
            //     u_HighlitedStateLayerGroup = L.layerGroup();
            //     u_highlightedState = null;
            //     console.debug('!drew, u_mode', !drew, u_mode);
            // } else if (drew && u_mode == 'usa') {
            //     if (u_HighlitedStatesLayerSuperGroup[drew]) {
            //         map.removeLayer(u_HighlitedStatesLayerSuperGroup[drew]);
            //         this.statesHidden.push(drew);
            //     }
            // }
        }


    }

    onPressPlayStateLapse() {
        if (appState[1]) {
            setAppState(AppStates.US_State_Timelapse, appState[1]);
            this.run();
        }
    }

    onPressRepeatStateLapse() {
        if (appState[1]) {
            setAppState(AppStates.US_State_Timelapse, appState[1]);
            this.run();
        }
    }

    onPressExitStateLapse() {
        if (appState[1]) {
            setAppState(AppStates.US_State_Latest, appState[1]);
            this.run();
        }
    }

    onPressPlayLapse() {
        setAppState(AppStates.US_Timelapse);
        this.run();
    }

    onPressRepeatLapse() {
        setAppState(AppStates.US_Timelapse);
        this.run();

    }

    onPressExitLapse() {
        setAppState(AppStates.US_Latest);
        this.run();
    }

    onPressBack() {
        this.stop();
        if (appState[0] == AppStates.US_State_Latest || appState[0] == AppStates.US_State_Timelapse) {
            setAppState(AppStates.US_Latest);
            this.run();
        } else {
            loadFromState(AppStates.Global_Latest);
        }
    }

    onToggleLatestCountyStateView() {
        let cm = appState[1] || 'state';

        appState[1] = cm == 'state' ? 'county' : 'state';
        $('#loading-warning').show();
        setTimeout(() => {
            this.run();
            $('#loading-warning').hide();
            if (isMobile()) {
                hideSidebar();
            }
        }, 250);
    }
}

var gj = {
    "type": "FeatureCollection",
    "features": []
}

function drawGL() {
    L.glify.shapes({
        map: map,
        data: gj
    });
}

// 

function uGetStatesAtPosition(position) {
    let possible = [];
    for (var fs in usaStateBbs) {
        let bb = usaStateBbs[fs];
        // console.log(bb, position)
        if (bb.contains(position)) {
            possible.push(fs);
        }
    }
    return possible;
}

function uGetCountyAtPosition(statefc, position) {
    let countiesFc = usaStateCounties[statefc];

    for (var countyFc of countiesFc) {
        let county = usaCounties[countyFc];
        if (!county) {
            console.warn('Unknown state county: ', countyFc, statefc);
            continue;
        }
        let polys = county.polys;

        for (var point of polys) {
            var _poly = L.Polygon.fromEncoded(point, { color: 'white' });
            if (L.isPointInsidePolygon({ lat: position[0], lng: position[1] }, _poly)) {
                return [countyFc, _poly];
            }
        }
    }

    return null;
}

function uGetCountyCases(countyFips, dayi) {
    if (!usaCountiesCases.length) {
        return [-1, null];
    }
    let spectrum = ['#003f5c', '#006987', '#009596', '#00c084', '#73e557', '#f6ff00'];

    let latest = usaCountiesCases[dayi != null ? dayi : (usaCountiesCases.length - 1)];
    let e = latest[2][countyFips];
    if (!e) {
        return [-1, null];
    }
    let cases_per_10k = e[0];

    let color = 'black';
    if (!cases_per_10k) {
        color = 'black'
    } else if (cases_per_10k < 2) {
        color = spectrum[0];
    } else if (cases_per_10k < 5) {
        color = spectrum[1];
    } else if (cases_per_10k < 10) {
        color = spectrum[2];
    } else if (cases_per_10k < 15) {
        color = spectrum[3];
    } else if (cases_per_10k < 20) {
        color = spectrum[4];
    } else if (cases_per_10k < 30) {
        color = spectrum[5];
    } else {
        color = 'red';
    }


    // console.debug(countyFips, cases_per_100k, color);
    return [cases_per_10k, color, e[1], e[2], e[3]];
}

function uGetStateCases(stateFips, dayi) {
    if (!usaCountiesCases.length) {
        return [-1, null];
    }
    let spectrum = ['#003f5c', '#006987', '#009596', '#00c084', '#73e557', '#f6ff00'];

    let latest = usaCountiesCases[dayi != null ? dayi : (usaCountiesCases.length - 1)];
    // console.log(latest)
    let e = latest[1][stateFips];
    if (!e) {
        return [-1, null];
    }

    let cases = e[1][0];
    let deaths = e[1][1];

    let cases_per_100k = e[2][0];

    let color = 'black';
    if (!cases_per_100k) {
        color = 'black'
    } else if (cases_per_100k < 100) {
        color = spectrum[0];
    } else if (cases_per_100k < 500) {
        color = spectrum[1];
    } else if (cases_per_100k < 1000) {
        color = spectrum[2];
    } else if (cases_per_100k < 2000) {
        color = spectrum[3];
    } else if (cases_per_100k < 4000) {
        color = spectrum[4];
    } else if (cases_per_100k < 8000) {
        color = spectrum[5];
    } else if (cases_per_100k < 12000) {
        color = '#ffa500';
    } else {
        color = '#ff0000';
    }

    let deaths_per_100k = e[2][1];

    let deathcolor = 'black';
    if (!cases_per_100k) {
        deathcolor = 'black'
    } else if (cases_per_100k < 20) {
        deathcolor = spectrum[0];
    } else if (cases_per_100k < 40) {
        deathcolor = spectrum[1];
    } else if (cases_per_100k < 60) {
        deathcolor = spectrum[2];
    } else if (cases_per_100k < 80) {
        deathcolor = spectrum[3];
    } else if (cases_per_100k < 100) {
        deathcolor = spectrum[4];
    } else if (cases_per_100k < 120) {
        deathcolor = spectrum[5];
    } else {
        deathcolor = 'red';
    }


    // console.debug(countyFips, cases_per_100k, color);
    return [cases_per_100k, deaths_per_100k, color, deathcolor, cases, deaths];
}

function uGetColorFromGender(males, females) {
    let rm = males / (males + females);
    let rf = females / (males + females);
    let pm = ((males / females) - 1) * 20;
    let pf = ((females / males) - 1) * 20;

    let dm = (rm * 100) - 50;
    let df = (rf * 100) - 50;
    // console.log(dm, df)

    if (rm > rf) {
        let spectrum = [ '#007971','#369990','#5abab1','#7ddcd2','#9ffff5' ];
        spectrum.reverse();
        let x = Math.min(4, Math.max(0, Math.round(dm)));
        let col = spectrum[x];
        // console.log('M', x);
        return col;
    } else {
        let spectrum = [ '#cd40ea', '#da67f0', '#e588f5', '#f0a7fa', '#f9c5ff' ];
        spectrum.reverse();
        let x = Math.min(4, Math.max(0, Math.round(df)));
        let col = spectrum[x];
        // console.log('F', x);
        return col;
    }
}

function uGetLatestCountyCaseData() {
    let latest = usaCountiesCases[usaCountiesCases.length - 1];
    return latest;
}

function uGetLatestDay() {
    let latest = usaCountiesCases[usaCountiesCases.length - 1];
    if (!latest) {
        return 'Error';
    }
    let day = latest[0];

    return uGetReadableDate(day);
}

function uGetReadableDate(day) {
    let [m, d, y] = day.split('-');
    let ds = MONTHS[parseInt(m) - 1] + ' ' + parseInt(d);
    return ds;
}