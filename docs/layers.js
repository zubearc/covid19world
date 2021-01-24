/**
 * Code based off of @zubearc's http://realtime.nyc/transitmaps/subway/mapcontrol.js
 */
var viewPos = [27.1858034, 7.5298966];
var viewZoom = 4;

var zoomToLoc = QueryString.getValue('location');
var zoomToLevel = QueryString.getValue('zoom');
if (zoomToLoc) {
    let s = zoomToLoc.split(",");
    viewPos = [s[0], s[1]];
}

if (zoomToLevel) {
    viewZoom = zoomToLevel;
}

var map = L.map('map', {
    // markerZoomAnimation: false
}).setView(viewPos, viewZoom);

var tileservers = [
    "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
    "http://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
    "http://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png",

]
var embedded = false;

// if (window.location.search.includes('embed=1')) {
//     embedded = true;
//     var tileserver = tileservers[2];
//     // document.getElementById("map").style ='background-color:white'; // chrome bug fix
//     document.getElementById("message-bar").style = 'color:black';
// } else {
//     var tileserver = tileservers[0];
//     document.getElementById('alert-box').style = 'display:none;'
// }

var tileserver = tileservers[0];

let sourcesAttribution = `Data: John Hopkins University, The New York Times.`;

var tile = L.tileLayer(tileserver, {
    attribution: 'Tiles &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a> &mdash; ' + sourcesAttribution,
    subdomains: 'abcd',
    maxZoom: 19
});

map.addLayer(tile);


function setTileServer(index) {
    map.removeLayer(tile);

    if (index < 10) {
        tileserver = tileservers[index];
        tile = L.tileLayer(tileserver, {
            attribution: 'Tiles &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a> &mdash; <a href="sources.html#ersi">Sources</a> &mdash;' + ((index == 1) ? 'Data: NYC Health Department' : sourcesAttribution),
            subdomains: 'abcd',
            maxZoom: 19,
            // minZoom: 2
        });
    } else if (index == 11) { //Ersi World Arial
        tile = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; <a href="sources.html#ersi">Sources</a> &mdash; ' + sourcesAttribution
        });
    }

    map.addLayer(tile);
}

////

// var map = L.map('map', {
//     layers: [osm],
//     center: new L.LatLng(0, 0),
//     zoom: 3,
//     maxBounds: [[90, -180], [-90, 180]]
// });


function uIsVisible() {

}

var global;
var usa;
var nyc;
var active = null;

function stopCurrentState() {
    active = null;
    if (global) {
        global.finish();
    }
    if (usa) {
        usa.finish();
    }
    if (nyc) {
        nyc.finish();
    }
}

function isValidState(state) {
    for (var appState in AppStates) {
        if (AppStates[appState] == state) {
            return true;
        }
    }
    return false;
}

function loadFromState(state, ...paramaters) {
    console.debug('Load from state', state, paramaters);

    if (isValidState(state)) {
        stopCurrentState();
    } else {
        console.warn('Invalid state!', state, paramaters);
        state = AppStates.Global_Latest
    }

    if (state == AppStates.Global_Latest) {
        global = new Global();
        active = global;

        global.init(() => {
            setAppState(AppStates.Global_Latest, paramaters);
            global.onLoad();
        })
    } else if (state == AppStates.Global_Timelapse) {
        global = new Global();
        active = global;

        global.init(() => {
            setAppState(AppStates.Global_Timelapse, paramaters);
            global.onLoad();
        })
    } else if (state == AppStates.US_Timelapse) {
        usa = new USA();
        active = usa;
        usa.init(() => {
            setAppState(AppStates.US_Timelapse);
            usa.onLoad();
        })
    } else if (state == AppStates.US_Latest) {
        usa = new USA();
        active = usa;

        usa.init(() => {
            setAppState(AppStates.US_Latest);
            usa.onLoad();
        })
    } else if (state == AppStates.US_State_Latest) {
        usa = new USA();
        active = usa;

        usa.init(() => {
            setAppState(AppStates.US_State_Latest, ...paramaters);
            usa.onLoad();
        })
    } else if (state == AppStates.US_State_Timelapse) {
        usa = new USA();
        active = usa;

        usa.init(() => {
            setAppState(AppStates.US_State_Timelapse, ...paramaters);
            usa.onLoad();
        })
    } else if (state == AppStates.US_NYC_Latest) {
        nyc = new NYC();
        active = nyc;

        nyc.init(() => {
            setAppState(AppStates.US_NYC_Latest);
            nyc.onLoad();
        })
    }
}

function setAppState(state, ...paramaters) {
    let nh = `#mode=${state}` + (paramaters.length ? '&params=' + paramaters.join(',') : '');
    window.location.hash = nh;
    appState = [state, ...paramaters];
}

window.onload = function () {


    if (QueryString.getValue('mode') == this.AppStates.US_Timelapse) {

    }

    let mode = QueryString.getValue('mode');
    let params = QueryString.getValue('params');

    this.loadFromState(mode || AppStates.Global_Latest, params ? params.split(',') : null);

    // gInit(() => {
    //     gOnLoad();
    //     // map.on('mousemove', function (e) {
    //     //     clearTimeout(timerMouseMove);
    //     //     timerMouseMove = setTimeout(() => {
    //     //         gOnMapMove(e.latlng);
    //     //         // uOnMapMove(e.latlng);
    //     //     }, 100);
    //     // })
    // })
    onHashChange();
}

// window.addEventListener('hashchange', function () {
//     console.log('The hash has changed!')
//     let mode = QueryString.getValue('mode');
//     loadFromState(mode);
// }, false);


function setBackgroundShade(shade) {
    if (shade == 'white') {
        $('body').css('background-color', '#d4dadc');
        $('#info').css('background-color', '#d4dadc');
        $('body').css('color', 'black');
    } else if (shade == 'black') {
        $('body').css('background-color', '#262626');
        $('#info').css('background-color', '#262626');
        $('body').css('color', 'white');
    } else if (shade == 'blue') {
        $('body').css('background-color', '#143f6a');
        $('#info').css('background-color', '#143f6a');
        $('body').css('color', 'white');
    }
}