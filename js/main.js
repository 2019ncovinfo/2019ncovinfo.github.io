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
    "lib/jquery.marquee"
], function(
    map 
){
//////////////////////////////////////////////////////////////////////////////

$(function(){

    $(".headline-marquee").marquee();



});

//////////////////////////////////////////////////////////////////////////////
});
