define(["leaflet"], function(L){
//////////////////////////////////////////////////////////////////////////////    

$("<div>", {id: "map"}).addClass("map").appendTo("body");


const map = L.map("map", {
    minZoom: 3,
    maxZoom: 4,
    maxBounds: [ [-90,-361], [90, 361] ],
});

var tiles = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
});

tiles.addTo(map);

map.setView([30, 120], 2);






return L;
//////////////////////////////////////////////////////////////////////////////    
});
