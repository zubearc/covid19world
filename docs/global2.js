var gCountryDaily = {};
var gCountryBbs = {};
var gCountryPolys = {};
var ISO2CCM = { "BD": "Bangladesh", "BE": "Belgium", "BF": "Burkina Faso", "BG": "Bulgaria", "BA": "Bosnia and Herzegovina", "BB": "Barbados", "WF": "Wallis and Futuna", "BL": "Saint Barth\u00e9lemy", "BM": "Bermuda", "BN": "Brunei", "BO": "Bolivia", "BH": "Bahrain", "BI": "Burundi", "BJ": "Benin", "BT": "Bhutan", "JM": "Jamaica", "BV": "Bouvet Island", "JO": "Jordan", "WS": "Samoa", "BQ": "Bonaire, Sint Eustatius and Saba", "BR": "Brazil", "BS": "Bahamas", "JE": "Jersey", "BY": "Belarus", "BZ": "Belize", "": ",MS Zaandam", "RU": "Russian Federation", "RW": "Rwanda", "RS": "Serbia", "TL": "Timor-Leste", "RE": "R\u00e9union", "TM": "Turkmenistan", "TJ": "Tajikistan", "RO": "Romania", "TK": "Tokelau", "GW": "Guinea-Bissau", "GU": "Guam", "GT": "Guatemala", "GS": "South Georgia and the South Sandwich Islands", "GR": "Greece", "GQ": "Equatorial Guinea", "GP": "Guadeloupe", "JP": "Japan", "GY": "Guyana", "GG": "Guernsey", "GF": "French Guiana", "GE": "Georgia", "GD": "Grenada", "GB": "United Kingdom", "GA": "Gabon", "GN": "Guinea", "GM": "Gambia", "GL": "Greenland", "GI": "Gibraltar", "GH": "Ghana", "OM": "Oman", "TN": "Tunisia", "BW": "Botswana", "HR": "Croatia", "HT": "Haiti", "HU": "Hungary", "HK": "Hong Kong", "HN": "Honduras", "HM": "Heard Island and McDonald Islands", "VE": "Venezuela", "PR": "Puerto Rico", "PS": "Palestine, State of", "PW": "Palau", "PT": "Portugal", "KN": "Saint Kitts and Nevis", "PY": "Paraguay", "AI": "Anguilla", "PA": "Panama", "PF": "French Polynesia", "PG": "Papua New Guinea", "PE": "Peru", "PK": "Pakistan", "PH": "Philippines", "PN": "Pitcairn", "PL": "Poland", "PM": "Saint Pierre and Miquelon", "ZM": "Zambia", "EH": "Western Sahara", "EE": "Estonia", "EG": "Egypt", "ZA": "South Africa", "EC": "Ecuador", "IT": "Italy", "VN": "Viet Nam", "SB": "Solomon Islands", "ET": "Ethiopia", "SO": "Somalia", "ZW": "Zimbabwe", "KY": "Cayman Islands", "ES": "Spain", "ER": "Eritrea", "ME": "Montenegro", "MD": "Moldova", "MG": "Madagascar", "MF": "Saint Martin", "MA": "Morocco", "MC": "Monaco", "UZ": "Uzbekistan", "MM": "Myanmar", "ML": "Mali", "MO": "Macao", "MN": "Mongolia", "MH": "Marshall Islands", "MK": "Republic of North Macedonia", "MU": "Mauritius", "MT": "Malta", "MW": "Malawi", "MV": "Maldives", "MQ": "Martinique", "MP": "Northern Mariana Islands", "MS": "Montserrat", "MR": "Mauritania", "AU": "Australia", "UG": "Uganda", "MY": "Malaysia", "MX": "Mexico", "IL": "Israel", "FR": "France", "IO": "British Indian Ocean Territory", "SH": "Saint Helena, Ascension and Tristan da Cunha", "AX": "\u00c5land Islands", "SJ": "Svalbard and Jan Mayen", "FI": "Finland", "FJ": "Fiji", "FK": "Falkland Islands", "FM": "Micronesia", "FO": "Faroe Islands", "NI": "Nicaragua", "NL": "Netherlands", "NO": "Norway", "NA": "Namibia", "VU": "Vanuatu", "NC": "New Caledonia", "NE": "Niger", "NF": "Norfolk Island", "NG": "Nigeria", "NZ": "New Zealand", "NP": "Nepal", "NR": "Nauru", "NU": "Niue", "CK": "Cook Islands", "XK": ",Kosovo", "CI": "C\u00f4te d'Ivoire", "CH": "Switzerland", "CO": "Colombia", "CN": "China", "CM": "Cameroon", "CL": "Chile", "CC": "Cocos Keeling Islands", "CA": "Canada", "CG": "Congo", "CF": "Central African Republic", "CD": "Congo", "CZ": "Czechia", "CY": "Cyprus", "CX": "Christmas Island", "CR": "Costa Rica", "CW": "Cura\u00e7ao", "CV": "Cabo Verde", "CU": "Cuba", "SZ": "Eswatini", "SY": "Syrian Arab Republic", "SX": "Sint Maarten", "KG": "Kyrgyzstan", "KE": "Kenya", "SS": "South Sudan", "SR": "Suriname", "KI": "Kiribati", "KH": "Cambodia", "SV": "El Salvador", "KM": "Comoros", "ST": "Sao Tome and Principe", "SK": "Slovakia", "KR": "Korea", "SI": "Slovenia", "KP": "Korea", "KW": "Kuwait", "SN": "Senegal", "SM": "San Marino", "SL": "Sierra Leone", "SC": "Seychelles", "KZ": "Kazakhstan", "SA": "Saudi Arabia", "SG": "Singapore", "SE": "Sweden", "SD": "Sudan", "DO": "Dominican Republic", "DM": "Dominica", "DJ": "Djibouti", "DK": "Denmark", "VG": "Virgin Islands", "DE": "Germany", "YE": "Yemen", "DZ": "Algeria", "US": "United States", "UY": "Uruguay", "YT": "Mayotte", "UM": "United States Minor Outlying Islands", "LB": "Lebanon", "LC": "Saint Lucia", "LA": "Lao People's Democratic Republic", "TV": "Tuvalu", "TW": "Taiwan", "TT": "Trinidad and Tobago", "TR": "Turkey", "LK": "Sri Lanka", "LI": "Liechtenstein", "LV": "Latvia", "TO": "Tonga", "LT": "Lithuania", "LU": "Luxembourg", "LR": "Liberia", "LS": "Lesotho", "TH": "Thailand", "TF": "French Southern Territories", "TG": "Togo", "TD": "Chad", "TC": "Turks and Caicos Islands", "LY": "Libya", "VA": "Holy See", "VC": "Saint Vincent and the Grenadines", "AE": "United Arab Emirates", "AD": "Andorra", "AG": "Antigua and Barbuda", "AF": "Afghanistan", "IQ": "Iraq", "VI": "Virgin Islands", "IS": "Iceland", "IR": "Iran", "AM": "Armenia", "AL": "Albania", "AO": "Angola", "AQ": "Antarctica", "AS": "American Samoa", "AR": "Argentina", "IM": "Isle of Man", "AT": "Austria", "AW": "Aruba", "IN": "India", "TZ": "Tanzania, United Republic of", "AZ": "Azerbaijan", "IE": "Ireland", "ID": "Indonesia", "UA": "Ukraine", "QA": "Qatar", "MZ": "Mozambique" };
var ISO2CP = { "BD": 161356039, "BE": 11422068, "BF": 19751535, "BG": 7024216, "BA": 3323929, "BB": 286641, "BL": 9131, "BM": 63968, "BN": 428962, "BO": 11353142, "JP": 126529100, "BI": 11175378, "BJ": 11485048, "BT": 754394, "JM": 2934855, "JO": 9956011, "WS": 196130, "BQ": 25157, "BR": 209469333, "BS": 385640, "BY": 9485386, "BZ": 383071, "TN": 11565204, "RW": 12301939, "RS": 6982084, "LT": 2789533, "RE": 859959, "LU": 607728, "TJ": 9100837, "RO": 19473936, "PG": 8606316, "GW": 1874309, "GU": 165768, "GT": 17247807, "GR": 10727668, "GQ": 1308974, "GP": 395700, "BH": 1569439, "GY": 779004, "GF": 290691, "GE": 3731000, "GD": 111454, "GB": 66488991, "GA": 2119275, "SV": 6420744, "GN": 12414318, "GM": 2280102, "GL": 56025, "KW": 4137309, "GI": 33718, "GH": 29767108, "OM": 4829483, "BW": 2254126, "HR": 4089400, "HT": 11123176, "HU": 9768785, "HK": 7451000, "HN": 9587522, "AD": 77006, "PR": 3195153, "PS": 4569087, "PW": 17907, "PT": 10281762, "PY": 6956071, "IQ": 38433600, "PA": 4176873, "PF": 277679, "UY": 3449299, "PE": 31989256, "PK": 212215030, "PH": 106651922, "PL": 37978548, "ZM": 17351822, "RU": 144478050, "EE": 1320884, "EG": 98423595, "ZA": 57779622, "EC": 17084357, "IT": 60431283, "AO": 30809762, "SB": 652858, "ET": 109224559, "ZW": 14439018, "KY": 64174, "ES": 46723749, "ER": 3534851, "ME": 622345, "MD": 3545883, "MG": 26262368, "MF": 37264, "MA": 36029138, "MC": 38682, "UZ": 32955400, "MM": 53708395, "ML": 19077690, "MO": 631636, "MN": 3170208, "MH": 58413, "MK": 2082958, "MU": 1265303, "MT": 483530, "MW": 18143315, "MV": 515696, "MQ": 376480, "MP": 56882, "MS": 5900, "MR": 4403319, "AU": 24992369, "UG": 42723139, "MY": 31528585, "MX": 126190788, "MZ": 29495962, "FR": 66987244, "FI": 5518050, "FJ": 883483, "FM": 112640, "FO": 48497, "NI": 6465513, "NL": 17231017, "NO": 5314336, "NA": 2448255, "VU": 292680, "NC": 284060, "NE": 22442948, "NG": 195874740, "NZ": 4885500, "NP": 28087871, "NR": 12704, "XK": 1932774, "CI": 25069229, "CH": 8516543, "CO": 49648685, "CN": 1392730000, "CM": 25216237, "CL": 18729160, "CA": 37058856, "CG": 5244363, "CF": 4666377, "CD": 84068091, "CZ": 10625695, "CY": 1189265, "CR": 4999441, "CW": 159849, "CV": 543767, "CU": 11338138, "SZ": 1136191, "SY": 16906283, "SX": 40654, "KG": 6315800, "KE": 51393010, "SS": 10975920, "SR": 575991, "KI": 115847, "KH": 16249798, "KN": 52441, "KM": 832322, "ST": 211028, "SK": 5447011, "KR": 51635256, "SI": 2067372, "KP": 25549819, "SO": 15008154, "SN": 15854360, "SM": 33785, "SL": 7650154, "SC": 96762, "KZ": 18276499, "SA": 33699947, "SG": 5638676, "SE": 10183175, "SD": 41801533, "DO": 10627165, "DM": 71625, "DJ": 958920, "DK": 5797446, "VG": 29802, "DE": 82927922, "YE": 28498687, "AT": 8847037, "DZ": 42228429, "US": 327167434, "YT": 270372, "LB": 6848925, "LC": 181889, "LA": 7061507, "TV": 11508, "TW": 23806748, "TT": 1389858, "TR": 82319724, "LK": 21670000, "LI": 37910, "LV": 1926542, "TO": 103197, "TL": 1267972, "TM": 5850908, "LR": 4818977, "LS": 2108132, "TH": 69428524, "TG": 7889094, "TD": 15477751, "TC": 37665, "LY": 6678567, "VA": 618, "VC": 110210, "AE": 9630959, "VE": 28870195, "AG": 96286, "AF": 37172386, "AI": 15094, "VI": 106977, "IS": 353574, "IR": 81800269, "AM": 2951776, "AL": 2866376, "VN": 95540395, "AS": 55465, "AR": 44494502, "IM": 84077, "IL": 8883800, "AW": 105845, "IN": 1352617328, "TZ": 56318348, "AZ": 9942334, "IE": 4853506, "ID": 267663435, "UA": 44622516, "QA": 2781677 };

var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

var AppStates = {
    US_State_Latest: 'usa-state-latest',
    US_State_Timelapse: 'usa-state-lapse',
    US_State_Strains: 'usa-state-strains',
    US_Timelapse: 'usa-country-lapse',
    US_Latest: 'usa-country-latest',
    US_NYC_Latest: 'usa-nyc-latest',
    US_NYC_Lapse: 'usa-nyc-lapse',
    Global_Latest: 'global-latest',
    Global_Timelapse: 'global-lapse'
};

// var appState = [AppStates.US_State_Latest, 'NY'];
var appHash = Date.now();
// ?mode=&p1=NY


var myRenderer = L.canvas({ padding: 0.5 });

function mapDisable() {
    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
}

function mapEnable() {
    map.dragging.enable();
    map.touchZoom.enable();
    map.doubleClickZoom.enable();
    map.scrollWheelZoom.enable();
    map.boxZoom.enable();
    map.keyboard.enable();
}

class Global {
    constructor() {
        // Day-by-day animation frame
        this.animationFrame = null;
        this.animationFrameCancelled = false;

        this.activeDayIndex = null;

        this.barStatsMode = 'cases';
        this.drawnCountriesLayerGroups = {};
    }

    // UTILS

    init(callback) {
        $.getJSON(SERVER_HOST + 'data/global/country-daily.json?' + Date.now(), function (data) {
            gCountryDaily = data;
            $.getJSON(SERVER_HOST + 'data/global/country-bounds.json', function (data2) {
                // gCountryBbs = data2;
                for (var fs in data2) {
                    let bbs = data2[fs];
                    for (var bb of bbs) {
                        if (gCountryBbs[fs]) {
                            gCountryBbs[fs].push(L.latLngBounds(bb));
                        } else {
                            gCountryBbs[fs] = [L.latLngBounds(bb)];
                        }
                    }
                }

                $.getJSON(SERVER_HOST + 'data/global/countries-polygons.json', function (data3) {
                    gCountryPolys = data3;
                    callback();
                })
            })
        })
    }

    bShowCaseStats(entry) {
        $('#stat-positives').text(numberWithCommas(entry.WW[0]));
        $('#stat-deaths').text(numberWithCommas(entry.WW[1]));
        $('#stat-recoveries').text(numberWithCommas(entry.WW[2]));
    }

    bShowCountryStats(entry, mode) {
        entry = entry || gCountryDaily.daily[this.activeDayIndex];
        mode = mode || this.barStatsMode;

        let topCCs = entry[mode == 'cases' ? 'WX' : (mode == 'deaths' ? 'WY' : 'WZ')];

        $('#top-countries').empty();

        for (var topCC of topCCs) {
            let color = gGetCountryCases(topCC[1], this.activeDayIndex);
            let onclick = `global.onPressCountry('${topCC[1]}')`;


            $('#top-countries').append(`
            <div onclick="${onclick}" style='background-color: ${color[1]};color: ${invertColor(color[1], true)};padding: 8px;font-weight: bold;text-align: left;'>
                <span>${ISO2CCM[topCC[1]]}</span>
                <span style='float:right;'>${topCC[0]}</span>
            </div>`)
        }
    }

    showDayByDayAnimation(showLatest, shouldRepeat) {
        if (showLatest) {
            gShowWorldState(null);
            return;
        }
        mapDisable();

        let data = gCountryDaily.daily;
        this.activeDayIndex = 0;

        let lastShown = [];

        var work = () => {
            let entry = data[this.activeDayIndex];

            if (!entry) {
                if (shouldRepeat) {
                    this.activeDayIndex = 0;
                    this.flushCountriesExcept([]);
                } else {
                    return false;
                }
                return true;
            }
            let [m, d, y] = gCountryDaily.days[this.activeDayIndex].split('/');
            let ds = MONTHS[parseInt(m) - 1] + ' ' + d;
            $('.g-ct').text(ds);
            $('#displayed-list').text(gCountryDaily.days[this.activeDayIndex]);
            console.log(entry.WW)

            this.bShowCaseStats(entry);

            this.bShowCountryStats(entry, this.barStatsMode);

            // gFlushMap(lastShown);

            this.gShowWorldState(this.activeDayIndex);

            this.activeDayIndex++;
            // console.log(i);
            return true;
        }

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
        loop();
    }

    gShowWorldState(dayi) {
        // let visibleCountries = gGetVisibleCountries();
        var prioritized = [];
        // console.log(visibleCountries)
        for (var iso2 in gCountryPolys) {
            let cases = gGetCountryCases(iso2, dayi);
            // console.log('iso2', iso2, cases);
            let casespk = cases[0];
            if (casespk < 0) {
                continue;
            }
            prioritized.push([casespk, iso2, cases]);
        }
        // console.log('presort', prioritized);
        prioritized.sort((a, b) => {
            return b[0] - a[0]
        });
        // console.log('sorted', prioritized);
        let top25 = prioritized;//.slice(0, 100);
        // console.log('top25', top25);
        let did = [];
        for (var e of top25) {
            if (e[0])
                this.drawCountry(e[1], e[2]);
            did.push(e[1]);
        }
        // gHideCountriesExcept(did);
        return did;
    }

    showLatestWorldStateInVR(region) {
        let visibleCountries = gGetVisibleCountries(region);
        var prioritized = [];
        this.activeDayIndex = gCountryDaily.daily.length - 1;
        let entry = gCountryDaily.daily[this.activeDayIndex];

        console.log(visibleCountries)

        mapEnable();

        for (var iso2 of visibleCountries) {
            let cases = gGetCountryCases(iso2);
            // console.log('iso2', iso2, cases);
            let casespk = cases[0];
            if (casespk < 0) {
                continue;
            }
            prioritized.push([casespk, iso2, cases]);
        }

        this.bShowCaseStats(entry);

        this.bShowCountryStats(entry, this.barStatsMode);

        // console.log('presort', prioritized);
        prioritized.sort((a, b) => {
            return b[0] - a[0]
        });
        // console.log('sorted', prioritized);
        let top25 = prioritized;//.slice(0, 100);
        // console.log('top25', top25);
        let did = [];
        for (var e of top25) {
            this.drawCountry(e[1], e[2]);
            did.push(e[1]);
        }
        this.hideCountriesExcept(did);
    }

    hideCountriesExcept(except) {
        for (var iso2 in gCountryPolys) {
            if (except.includes(iso2)) {
                continue;
            }
            if (this.drawnCountriesLayerGroups[iso2]) {
                map.removeLayer(this.drawnCountriesLayerGroups[iso2]);
            }
        }
    }

    flushCountriesExcept(except) {
        except = except || [];
        for (var iso2 in this.drawnCountriesLayerGroups) {
            if (except.includes(iso2)) {
                continue;
            }
            if (this.drawnCountriesLayerGroups[iso2]) {
                map.removeLayer(this.drawnCountriesLayerGroups[iso2]);
                delete this.drawnCountriesLayerGroups[iso2];
            }
        }
        this.drawnCountriesLayerGroups = {};
    }

    onPressCountry(iso2) {
        if (iso2 == 'US') {
            loadFromState(AppStates.US_Latest);
        } else {
            let bb = gCountryBbs[iso2];
            map.fitBounds(bb);
        }
    }

    drawCountry(iso2, casesAndColor, forceRedraw) {
        let polys = gCountryPolys[iso2];
        let pop = ISO2CP[iso2];

        if (this.drawnCountriesLayerGroups[iso2] == null) {
            this.drawnCountriesLayerGroups[iso2] = L.layerGroup();
        } else if (!forceRedraw) {
            this.drawnCountriesLayerGroups[iso2].eachLayer((layer) => {
                layer.setStyle({ color: casesAndColor[1], fillOpacity: 0.75 });
                layer.bindTooltip(`
                    <b>${ISO2CCM[iso2]}</b> (${iso2}) <br/><br/>
                    <b>COVID-19 Cases<br/> Confirmed: </b>${numberWithCommas(casesAndColor[2])}, <b>Recovered: </b>${numberWithCommas(casesAndColor[4])}, <b>Deaths: </b> <span class='sd'>${numberWithCommas(casesAndColor[3])}</span><br/><br/>
                    <b>Country Data</b><br/>
                    <b>Population</b>: ${numberWithCommas(pop)} (${numberWithCommas(casesAndColor[0])} positives per million)<br/>
                    <br/>`);
            })

            // map.addLayer(group);

            // let pop = ISO2CP[iso2];

            // for (var poly of polys) {
            //     let gon = L.Polygon.fromEncoded(poly, { renderer: myRenderer, color: casesAndColor[1], weight: 0, fillOpacity: 0.75 });
            //     gon.bindTooltip(`
            // <b>${ISO2CCM[iso2]}</b> (${iso2}) <br/><br/>
            // <b>COVID-19 Cases<br/> Active: </b>${casesAndColor[2]}, <b>Recovered: </b>${casesAndColor[4]}, <b>Deaths: </b> <span class='sd'>${casesAndColor[3]}</span><br/><br/>
            // <b>Country Data</b><br/>
            // <b>Population</b>: ${numberWithCommas(pop)}<br/>`);
            //     group.addLayer(gon);
            //     // gon.addTo(map);
            // }
            return;
        }

        // map.(group);

        // let casesAndColor = gGetCountryCases(iso2);

        for (var poly of polys) {
            let gon = L.Polygon.fromEncoded(poly, { renderer: myRenderer, color: casesAndColor[1], weight: 0, fillOpacity: 0.75 });
            gon.bindTooltip(`
            <b>${ISO2CCM[iso2]}</b> (${iso2}) <br/><br/>
            <b>COVID-19 Cases<br/> Confirmed: </b>${numberWithCommas(casesAndColor[2])}, <b>Recovered: </b>${numberWithCommas(casesAndColor[4])}, <b>Deaths: </b> <span class='sd'>${numberWithCommas(casesAndColor[3])}</span><br/><br/>
            <b>Country Data</b><br/>
            <b>Population</b>: ${numberWithCommas(pop)} (${numberWithCommas(casesAndColor[0])} positives per million)<br/>`);
            if (iso2 == 'US') {
                gon.on('click', () => {
                    this.onPressCountry(iso2);
                })
            }
            this.drawnCountriesLayerGroups[iso2].addLayer(gon);
        }
        map.addLayer(this.drawnCountriesLayerGroups[iso2]);
    }

    onLoad() {
        $.get('component-global-panel.html?' + appHash, (data) => {
            $('#info-area').html(data);
            this.run();
        })
    }

    stop() {
        L.Util.cancelAnimFrame(this.animationFrame);
        this.animationFrame = null;
        this.animationFrameCancelled = true;
    }

    _flush() {
        this.flushCountriesExcept([]);
    }

    run() {
        this.stop();
        this._flush();
        $('#header-text').text('Covid-19 Worldwide');
        setTileServer(0);
        $('body').css('background-color', '#262626');
        $('body').css('color', 'white');
        $('#back-text').html('');

        let bb = L.latLngBounds([67.339861, -136.40625], [-36.031332, 151.875]);
        map.fitBounds(bb);

        if (appState[0] == AppStates.Global_Latest) {
            $('#header-date').html(`
            <div style='margin-top: 16px;margin-bottom: 16px; text-align: center;display: flex;justify-content: space-between;'>
            <span>
                <span class='g-btn' onclick='global.onPressPlayLapse()'>▶ Play
                    timelapse</span>
            </span>
            <span class='g-ct' id='g-timelapse-ds'>${gGetLatestDay()}</span>
            </div>`)
            this.showLatestWorldStateInVR(L.latLngBounds([83.829945, -170.15625], [-61.270233, 190.898438]));
        } else if (appState[0] == AppStates.Global_Timelapse) {
            $('#header-date').html(`
            <div style='margin-top: 16px;margin-bottom: 16px; text-align: center;display: flex;justify-content: space-between;'>
            <span>
                <span class='g-btn' onclick='global.onPressExitLapse()'>
                    &larr; Exit timelapse
                </span>
                <span class='g-btn' style='margin-left:8px;' onclick='global.onPressRepeatLapse()'>🔁</span>    
            </span>

            <span class='g-ct' id='g-timelapse-ds'>Loading...</span>
            </div>`)
            this.showDayByDayAnimation();
        }
    }

    finish() {
        this.stop();
        this._flush();
        gCountryDaily = {};
        gCountryPolys = {};
    }

    // Event Handlers
    onSelectCountryStatsMode(mode) {
        this.barStatsMode = mode;
        $('.gcs').prop('class', 'gcs g-disabled');
        $('#gcs-' + mode).prop('class', 'gcs g-enabled');
        this.bShowCountryStats();
    }

    setState(state) {
        if (appState == state) {
            return;
        }
        setAppState(AppStates.Global_Timelapse);
        this.run();
    }

    onPressPlayLapse() {
        setAppState(AppStates.Global_Timelapse);
        this.run();
    }

    onPressRepeatLapse() {
        setAppState(AppStates.Global_Timelapse);
        this.run();

    }

    onPressExitLapse() {
        setAppState(AppStates.Global_Latest);
        this.run();
    }
}


// 

function gIsPointInCountry(iso2) {
    let bbs = gCountryBbs[iso2];
    // console.log(bb, position)
    for (var bb of bbs) {
        if (bb.contains(position)) {
            return true;
        }
    }
    return false;
}

function gIsBBIntersectingCountry(iso2, x) {
    let bbs = gCountryBbs[iso2];
    // console.log(bb, position)
    for (var bb of bbs) {
        if (bb.intersects(x)) {
            return true;
        }
    }
    return false;
}

function gGetVisibleCountries(region) {
    let mapBounds = region || map.getBounds();
    let yes = [];
    for (var iso2 in gCountryPolys) {
        if (gIsBBIntersectingCountry(iso2, mapBounds)) {
            yes.push(iso2);
        }
    }
    return yes;
}

function gGetCountryAtPosition(position) {
    let possible = [];
    for (var fs in gCountryBbs) {
        let bbs = gCountryBbs[fs];
        // console.log(bb, position)
        for (var bb of bbs) {
            if (bb.contains(position)) {
                possible.push(fs);
            }
        }
    }
    return possible;
}


function gGetCountryCases(iso2, dayi) {
    if (!gCountryDaily) {
        return [-1, null];
    }
    let spectrum = ['#003f5c', '#006987', '#009596', '#00c084', '#73e557', '#f6ff00'];

    let latest = gCountryDaily.daily[dayi != null ? dayi : (gCountryDaily.daily.length - 1)];
    let e = latest[iso2];
    if (!e) {
        return [-1, null];
    }
    let cases_per_100k = e[3];
    // console.log(cases_per_100k)

    let color = 'black';
    if (!cases_per_100k) {
        color = '#000000'
    } else if (cases_per_100k < 2) {
        color = spectrum[0];
    } else if (cases_per_100k < 100) {
        color = spectrum[1];
    } else if (cases_per_100k < 500) {
        color = spectrum[2];
    } else if (cases_per_100k < 1000) {
        color = spectrum[3];
    } else if (cases_per_100k < 10000) {
        color = spectrum[4];
    } else if (cases_per_100k < 20000) {
        color = spectrum[5];
    } else if (cases_per_100k < 40000) {
        color = '#ffa500';
    } else {
        color = '#ff0000';
    }


    // console.debug(iso2, cases_per_100k, color);
    return [cases_per_100k, color, e[0], e[1], e[2]];
}

function gGetLatestDay() {
    let latest = gCountryDaily.days[gCountryDaily.days.length - 1];
    if (!latest) {
        return 'Error';
    }
    let day = latest;

    return gGetReadableDate(day);
}

function gGetReadableDate(day) {
    let [m, d, y] = day.split('/');
    let ds = MONTHS[parseInt(m) - 1] + ' ' + parseInt(d);

    return ds;
}