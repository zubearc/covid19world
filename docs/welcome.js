// TODO: Host on Google Cloud maybe?
var SERVER_HOST = '';


$('#mobile-map-toggle-btn').click(() => {
    $('#info').css('z-index', '0');
})

$('.leaflet-control-zoom').append(`<a class='mobile' onclick="showSidebar()" href="#" title="Back" role="button" aria-label="Back to panel" style="
">&#9664;</a>`);

function showSidebar() {
    $('#info').css('z-index', '2');
}

function hideSidebar() {
    $('#info').css('z-index', '0');
}

function onTimelapseStart() {
    
}

// same as CSS
var _isMobile = window.innerWidth < 1000;

function isMobile() {
    return window.innerWidth < 1000;
}

// State change listener

var didHide = false;

function onHashChange() {
    let mode = QueryString.getValue('mode');
    if (!mode) {
        return;
    }
    
    if (mode.includes('lapse')) {
        if (_isMobile) {
            // anti-crash, crashes my iphone when using zoom (prob. can't handle canvas re-rendering)
            $('#super-text').show();
            $('.leaflet-control-zoom-in').hide();
            $('.leaflet-control-zoom-out').hide();
            didHide = true;
        }
    } else if (didHide) {
        $('.leaflet-control-zoom-in').show();
        $('.leaflet-control-zoom-out').show();
        $('#super-text').hide();
        didHide = false;
    }
}

window.addEventListener('hashchange', function () {
    console.log('The hash has changed!')
    onHashChange();
}, false);