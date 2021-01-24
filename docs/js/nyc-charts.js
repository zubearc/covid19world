window.chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
};

(function (global) {
    var MONTHS = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    var COLORS = [
        '#4dc9f6',
        '#f67019',
        '#f53794',
        '#537bc4',
        '#acc236',
        '#166a8f',
        '#00a950',
        '#58595b',
        '#8549ba'
    ];

    var Samples = global.Samples || (global.Samples = {});
    var Color = global.Color;

    Samples.utils = {
        // Adapted from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
        srand: function (seed) {
            this._seed = seed;
        },

        rand: function (min, max) {
            var seed = this._seed;
            min = min === undefined ? 0 : min;
            max = max === undefined ? 1 : max;
            this._seed = (seed * 9301 + 49297) % 233280;
            return min + (this._seed / 233280) * (max - min);
        },

        numbers: function (config) {
            var cfg = config || {};
            var min = cfg.min || 0;
            var max = cfg.max || 1;
            var from = cfg.from || [];
            var count = cfg.count || 8;
            var decimals = cfg.decimals || 8;
            var continuity = cfg.continuity || 1;
            var dfactor = Math.pow(10, decimals) || 0;
            var data = [];
            var i, value;

            for (i = 0; i < count; ++i) {
                value = (from[i] || 0) + this.rand(min, max);
                if (this.rand() <= continuity) {
                    data.push(Math.round(dfactor * value) / dfactor);
                } else {
                    data.push(null);
                }
            }

            return data;
        },

        labels: function (config) {
            var cfg = config || {};
            var min = cfg.min || 0;
            var max = cfg.max || 100;
            var count = cfg.count || 8;
            var step = (max - min) / count;
            var decimals = cfg.decimals || 8;
            var dfactor = Math.pow(10, decimals) || 0;
            var prefix = cfg.prefix || '';
            var values = [];
            var i;

            for (i = min; i < max; i += step) {
                values.push(prefix + Math.round(dfactor * i) / dfactor);
            }

            return values;
        },

        months: function (config) {
            var cfg = config || {};
            var count = cfg.count || 12;
            var section = cfg.section;
            var values = [];
            var i, value;

            for (i = 0; i < count; ++i) {
                value = MONTHS[Math.ceil(i) % 12];
                values.push(value.substring(0, section));
            }

            return values;
        },

        color: function (index) {
            return COLORS[index % COLORS.length];
        },

        transparentize: function (color, opacity) {
            var alpha = opacity === undefined ? 0.5 : 1 - opacity;
            return Color(color).alpha(alpha).rgbString();
        }
    };

    // DEPRECATED
    window.randomScalingFactor = function () {
        return Math.round(Samples.utils.rand(-100, 100));
    };

}(this));


var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var color = Chart.helpers.color;

function nycLoadRatesByBoro(data) {
    var horizontalBarChartData = {    
        labels: ['The Bronx', 'Staten Island', 'Queens', 'Brooklyn', 'Manhattan'],
        datasets: [{
            label: 'Cases per 100,000',
            backgroundColor: color('dodgerblue').alpha(1).rgbString(),
            // borderColor: window.chartColors.purple,
            borderWidth: 1,
            data: data
        },
            // {
            //     label: 'Dataset 2',
            //     backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
            //     borderColor: window.chartColors.blue,
            //     data: [
            //         randomScalingFactor(),
            //         randomScalingFactor(),
            //         randomScalingFactor(),
            //         randomScalingFactor(),
            //         randomScalingFactor(),
            //         randomScalingFactor(),
            //         randomScalingFactor()
            //     ]
            // }
        ]
    };

    var ctx = document.getElementById('canvas').getContext('2d');
    window.myHorizontalBar = new Chart(ctx, {
        type: 'horizontalBar',
        data: horizontalBarChartData,
        options: {
            // Elements options apply to all of the options unless overridden in a dataset
            // In this case, we are setting the border of each horizontal bar to be 2px wide
            elements: {
                rectangle: {
                    borderWidth: 2,
                }
            },
            responsive: true,
            legend: {
                display: false,
                labels: {
                    fontColor: 'black'
                }
                // position: 'right',
            },
            title: {
                display: false,
                text: 'Chart.js Horizontal Bar Chart'
            },

            scales: {
                yAxes: [{
                    ticks: {
                        fontColor: "white",
                        fontStyle: 'oblique',
                        fontSize: 18,
                        stepSize: 1,
                        mirror: true,
                        beginAtZero: true,
                        padding: -8,
                        z: 1
                    },
                    // barThickness: 40,
                    // maxBarThickness: 40,
                    // barPercentage: 1,
                    // categorySpacing: 36
                }],
                xAxes: [{
                    ticks: {
                        fontColor: "black",
                        fontSize: 14,
                        stepSize: 1,
                        mirror: true,
                        beginAtZero: true,
                        // padding: 8,
                        z: 1
                    }
                }]
            }
        }
    });
}

function nycLoadDayOverDay(data) {
    // 3209, 3072, 2962, 2005, 1909

    data = data || [
        ['3/25', 3209, 658, 92], ['3/26', 3072, 693, 67], ['3/27', 2962, 720, 55],
        ['3/28', 2005, 608, 38], ['3/29', 1909, 545, 19]
    ];

    let labels = [];
    let hos = [];
    let dea = [];
    let all = [];
    for (var d of data) {
        labels.push(d[0]);
        all.push(d[1]);
        hos.push(d[2]);
        dea.push(d[3]);
    }

    var horizontalBarChartData2 = {
        labels: labels,
        datasets: [
            {
                label: 'Deaths',
                backgroundColor: color('red').alpha(1).rgbString(),
                // borderColor: window.chartColors.blue,
                borderWidth: 1,
                fill: true,
                data: dea
            },
            {
                label: 'Hospitalizations',
                backgroundColor: color('orange').alpha(1).rgbString(),
                // borderColor: window.chartColors.blue,
                borderWidth: 1,
                fill: true,
                data: hos
            },
            {
                label: 'New cases',
                backgroundColor: color('dodgerblue').alpha(1).rgbString(),
                // borderColor: window.chartColors.purple,
                fill: true,
                borderWidth: 1,
                data: all
            },
        ]
    };

    if (window.uNYCChartDoD) {
        uNYCChartDoD.data = horizontalBarChartData2;
        uNYCChartDoD.options.animation.duration = 0;
        console.warn('updating', data, horizontalBarChartData2);
        uNYCChartDoD.update();
        return;
    }

    var ctx2 = document.getElementById('canvas2').getContext('2d');
    window.uNYCChartDoD = new Chart(ctx2, {
        type: 'line',
        data: horizontalBarChartData2,
        options: {
            // Elements options apply to all of the options unless overridden in a dataset
            // In this case, we are setting the border of each horizontal bar to be 2px wide
            elements: {
                rectangle: {
                    borderWidth: 2,
                }
            },
            responsive: true,
            legend: {
                display: true,
                labels: {
                    fontColor: 'black'
                }
                // position: 'right',
            },
            title: {
                display: false,
                text: 'Chart.js Horizontal Bar Chart'
            },

            scales: {
                yAxes: [{
                    ticks: {
                        // fontColor: "black",
                        // fontStyle: 'oblique',
                        fontSize: 18,
                        stepSize: 1,
                        mirror: false,
                        beginAtZero: true,
                        padding: -8,
                        z: 1
                    },
                    // barThickness: 40,
                    // maxBarThickness: 40,
                    // barPercentage: 1,
                    // categorySpacing: 36
                }],
                xAxes: [{
                    ticks: {
                        fontColor: "black",
                        fontSize: 14,
                        stepSize: 1,
                        mirror: true,
                        beginAtZero: true,
                        // padding: 8,
                        z: 1
                    }
                }]
            }
        }
    });
}

function nycUpdateDayOverDay(data, xScalingFrame) {
    // window.uNYCChartDoD.options.scales.xAxes[0].min = xScalingFrame[0];
    // window.uNYCChartDoD.options.scales.xAxes[0].max = xScalingFrame[1];
    // window.uNYCChartDoD.update();

    let slice = data.slice(...xScalingFrame);
    if (slice.length)
        nycLoadDayOverDay(slice);
}

var nycChartDodWidth;
var nycChartDodFrame = [0, Infinity];

function nycLoadCharts() {
    // ['Queens', 'The Bronx', 'Brooklyn', 'Manhattan', 'Staten Island']
    let nyc_boro_data = [nycBoroData['The Bronx'][1], nycBoroData['Staten Island'][1], 
    nycBoroData['Queens'][1], nycBoroData['Brooklyn'][1], nycBoroData['Manhattan'][1]];

    nycLoadRatesByBoro(nyc_boro_data);
    nycChartDodWidth = nycCitywideDailyCases.length;
    let dodData = nycCitywideDailyCases;
    nycLoadDayOverDay(dodData);
    // console.log('dod',dodData);
    nycLoadSexRatios();
};

function nycChartDodNext() {
    if (nycChartDodFrame[1] == Infinity) {
        return;
    }
    // let l = Math.max(0, nycChartDodFrame[0] + 2);
    // let u = Math.min(nycCitywideDailyCases.length, nycChartDodFrame[1] + 2);
    // if (Math.abs(l - u) < nycChartDodWidth) {
    //     return;
    // }
    if ((nycChartDodFrame[1] + 1) > nycCitywideDailyCases.length) {
        return;
    }
    nycChartDodFrame = [nycChartDodFrame[0] + 2, nycChartDodFrame[1] + 2];
    nycUpdateDayOverDay(nycCitywideDailyCases, nycChartDodFrame);
}

function nycChartDodBack() {
    if (nycChartDodFrame[1] == Infinity) {
        nycChartDodFrame[1] = nycCitywideDailyCases.length;
        return;
    }
    if ((nycChartDodFrame[0] - 1) < 0) {
        return;
    }
    if ((nycChartDodFrame[1]) > nycCitywideDailyCases.length) {
        nycChartDodFrame[1] = nycCitywideDailyCases.length;
    }
    nycChartDodFrame = [nycChartDodFrame[0] - 2, nycChartDodFrame[1] - 2];
    nycUpdateDayOverDay(nycCitywideDailyCases, nycChartDodFrame);
}

function nycChartDodZoomIn() {
    // if ((nycChartDodFrame[1] + 2) > nycCitywideDailyCases.length)
    //     return;
    nycChartDodFrame[0] += 2;
    nycChartDodFrame[1] -= 2;
    nycUpdateDayOverDay(nycCitywideDailyCases, nycChartDodFrame);
}

function nycChartDodZoomOut() {
    // if ((nycChartDodFrame[0] - 2) < 0)
    //     return;
    nycChartDodFrame[0] -= 2;
    nycChartDodFrame[1] += 2;
    nycUpdateDayOverDay(nycCitywideDailyCases, nycChartDodFrame);
}

function nycLoadSexRatios() {
    let m = nycSexData['Male'];
    let mhosp = m[1];
    let mdeath = m[2];

    let f = nycSexData['Female'];
    let fhosp = f[1];
    let fdeath = f[2];

    let mHospPercent = (mhosp / (mhosp + fhosp)) * 100;
    let fHospPercent = (fhosp / (mhosp + fhosp)) * 100;

    let mDeathPercent = (mdeath / (mdeath + fdeath)) * 100;
    let fDeathPercent = (fdeath / (mdeath + fdeath)) * 100;

    $('#sd-death .male').css('width', mDeathPercent.toFixed(1) + '%');
    $('#sd-death .female').css('width', fDeathPercent.toFixed(1) + '%');
    $('#sd-death .male .value').text(mDeathPercent.toFixed(1) + '%');
    $('#sd-death .female .value').text(fDeathPercent.toFixed(1) + '%');


    $('#sd-hosp .male').css('width', mHospPercent.toFixed(1) + '%');
    $('#sd-hosp .female').css('width', fHospPercent.toFixed(1) + '%');
    $('#sd-hosp .male .value').text(mHospPercent.toFixed(1) + '%');
    $('#sd-hosp .female .value').text(fHospPercent.toFixed(1) + '%');

}

// todo: figure out way to display this
function nycLoadAgeRatios() {

}

// window.onload = nycLoadCharts;