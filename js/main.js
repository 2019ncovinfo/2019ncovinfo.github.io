requirejs.config({
    baseUrl: "/js/",
    paths: {
        eventemitter: "lib/eventemitter",
    },
    shim: {
        "leaflet": ["lib/leaflet", "lib/leaflet.heat"],
    }
});

require([
    "map.init",
    
    "map.china",
    "display.number",
    "display.news",
], function(
){
//////////////////////////////////////////////////////////////////////////////

$(function(){

    $("#tabs").tabs();

    $("#disease-overlay-open").click(()=>$("#disease-overlay").show());
    $("#disease-overlay-close").click(()=>$("#disease-overlay").hide());


});

//////////////////////////////////////////////////////////////////////////////
});
