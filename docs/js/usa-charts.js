
var fcolors = //{"": "#010101", "36113": "#309400", "36089": "#419b00", "36081": "#fb1000", "36083": "#d88400", "36085": "#f52700", "36117": "#a7b900", "36087": "#fd0800", "36001": "#e46000", "36003": "#4d9f00", "36123": "#010101", "36005": "#f91800", "36121": "#ce9f00", "36007": "#a0b700", "36009": "#010101", "36077": "#60a500", "36109": "#d49000", "36067": "#d68a00", "36029": "#d29500", "36049": "#010101", "36061": "#f32f00", "36101": "#c4b700", "36023": "#7bad00", "36103": "#ed4500", "36021": "#dc7900", "36105": "#e85200", "36041": "#e06d00", "36107": "#479d00", "36043": "#c2bb00", "36065": "#66a700", "36111": "#e26600", "36073": "#59a300", "36075": "#359700", "36071": "#ef3e00", "36069": "#b7bd00", "36099": "#010101", "36045": "#3b9900", "36097": "#010101", "36095": "#74ab00", "36093": "#de7300", "36059": "#f72000", "36091": "#da7f00", "36017": "#6da900", "36015": "#98b500", "36047": "#f13600", "36013": "#1b8c00", "36011": "#2b9200", "36079": "#eb4c00", "36019": "#caa900", "36027": "#e65900", "36039": "#bfbf00", "36051": "#53a100", "36119": "red", "36057": "#afbb00", "36055": "#d09a00", "36031": "#c8ae00", "36053": "#c6b300", "36033": "#259000", "36025": "#cca400", "36035": "#208e00", "36063": "#89b100", "36037": "#91b300", "36115": "#82af00"};
{"": "#010101", "36113": "#4d9f00", "36089": "#89b100", "36081": "red", "36083": "#d68a00", "36085": "#f13600", "36117": "#c2bb00", "36087": "#ef3e00", "36001": "#e65900", "36003": "#4d9f00", "36123": "#010101", "36005": "#f91800", "36121": "#bfbf00", "36007": "#d09a00", "36009": "#010101", "36077": "#66a700", "36109": "#d29500", "36067": "#e26600", "36029": "#eb4c00", "36049": "#010101", "36061": "#f72000", "36101": "#caa900", "36023": "#66a700", "36103": "#f32f00", "36021": "#d49000", "36105": "#d88400", "36041": "#4d9f00", "36107": "#4d9f00", "36043": "#bfbf00", "36065": "#cca400", "36111": "#de7300", "36073": "#4d9f00", "36075": "#89b100", "36071": "#ed4500", "36069": "#caa900", "36099": "#010101", "36045": "#89b100", "36097": "#010101", "36095": "#4d9f00", "36093": "#da7f00", "36059": "#f52700", "36091": "#dc7900", "36017": "#66a700", "36015": "#bfbf00", "36047": "#fd0800", "36013": "#4d9f00", "36011": "#4d9f00", "36079": "#e06d00", "36019": "#caa900", "36027": "#e85200", "36039": "#a0b700", "36051": "#66a700", "36119": "#fb1000", "36057": "#a0b700", "36055": "#e46000", "36031": "#a0b700", "36053": "#c4b700", "36033": "#208e00", "36025": "#bfbf00", "36035": "#208e00", "36063": "#ce9f00", "36037": "#89b100", "36115": "#89b100"}

function usStateSelect(state) {
    $('.leaflet-timeline-control').hide();
    $('body').css('background-color', '#143f6a');
    $('body').css('color', 'white');
    // uNYCLoad_DrawPanel();
    // uNYCShowCovidRatesByZip();
    setTileServer(11);
    usaSelectedState = state;
    uHighlightState(state, uGetLatestCountyCaseData());
}

