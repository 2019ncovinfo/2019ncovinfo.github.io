define([], function(){
//////////////////////////////////////////////////////////////////////////////    

$("<div>", {id: "map"}).addClass("map").appendTo("body");


const map = L.map("map", {
    preferCanvas: true,
    minZoom: 3,
    maxZoom: 5,
    maxBounds: [ [-90,-361], [90, 361] ],
});

var tiles = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
});

tiles.addTo(map);

map.setView([30, 120], 3);



return map;
//////////////////////////////////////////////////////////////////////////////    
});
