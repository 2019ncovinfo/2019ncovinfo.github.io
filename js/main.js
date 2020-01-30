requirejs.config({
    baseUrl: "/js/",
    paths: {
        leaflet: "lib/leaflet",
        eventemitter: "lib/eventemitter",
    }
});

require([
    "map.init",
    
    "map.china",
    "display.data",
    "display.news",
], function(
){
//////////////////////////////////////////////////////////////////////////////

$(function(){




});

//////////////////////////////////////////////////////////////////////////////
});
