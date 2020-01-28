define(["leaflet", "map.init", "data.china"], function(L, map, CHINA){
//////////////////////////////////////////////////////////////////////////////

const provinces = {};
const regionFilterCallbacks = [];

function regionFilterFactory(id, target){
    /* Generates a listener on filter actions. When this listener is called
    with a filterId and this being a prefix of id, react and pass itself to
    callback. */
    return function filter(filterId, callback){
        filterId = filterId.toString();
        if(id.toString().slice(0, filterId.length) != filterId) return;
        callback(target); 
    }
}

function filterRegion(id, callback){
    /* Fetch all sub-regions under given Id, and apply callback on them.*/
    regionFilterCallbacks.forEach((each) => each(id, callback));
}

for(var provinceId in CHINA){
    provinces[provinceId] = L.geoJSON(CHINA[provinceId], {
        onEachFeature: function(feature, layer){
            // on each feature in this GeoJSON is created and styled
            regionFilterCallbacks.push(regionFilterFactory(
                feature.properties.id,
                layer
            ));
            layer.on("click", function(e){
                filterRegion(e.target.feature.properties.id.toString().slice(0,2), function(target){
                    target.setStyle({ fillOpacity: 0.2 });
                });
            });
        },
        style: function(){ return {
            color: "#ffffff",
            weight: 1,
            opacity: 0.2,
            fillOpacity: 0,
        } },
    }).addTo(map);
}



//////////////////////////////////////////////////////////////////////////////
});
