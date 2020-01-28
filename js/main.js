requirejs.config({
    baseUrl: "/js/",
    paths: {
        leaflet: "lib/leaflet",
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
