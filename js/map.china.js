define([
    "eventemitter",
    "map.init",
    "data.china.geojson",
], function(
    EventEmitter,
    map,
    CHINA
){

//////////////////////////////////////////////////////////////////////////////

const heatmap = L.heatLayer([], {
    radius: 8,
    blur: 5,
    gradient: {
        0.1: "#AA0000",
        0.9: "#FF0000",
    }
}).addTo(map); // first adds, goes to bottom


const mapSelectorEventEmitter = new EventEmitter();

const provinces = {};
const regionFilterCallbacks = [];
const regionsAsFeaturesById = {};

function regionFilterFactory(id, target){
    /* Generates a listener on filter actions. When this listener is called
    with a filterId and this being a prefix of id, react and pass itself to
    callback. */
    return function filter(filterId, callback, negativeCallback){
        filterId = filterId.toString();
        if(id.toString().slice(0, filterId.length) != filterId){
            if(negativeCallback) negativeCallback(target);
            return;
        }
        if(callback) callback(target);
    }
}

function filterRegion(id, callback, negativeCallback){
    /* Fetch all sub-regions under given Id, and apply callback on them. Apply
    non-matching targets to negativeCallback.*/
    regionFilterCallbacks.forEach(
        (each) => each(id, callback, negativeCallback));
}




/* Bind events during onEachFeature call. Adds filter callback listener, and
on("click") event handler.*/

function onRegionClicked(clickedFeature){
    /* Behaviour: show and emit event on selected region(s).

    At smallest zoom level: select whole country.
    At middle zoom level: select a province.
    At larger zoom level: sleect a city.
    */
    const zoomLevel = map.getZoom();
    var filterRegionId = clickedFeature.properties.id.toString();

    if(zoomLevel <= 3){
        filterRegionId = filterRegionId.slice(0, 2); // e.g. CN, country
    } else if (true || zoomLevel <= 5){ // disable city selection, minimal province
        filterRegionId = filterRegionId.slice(0, 4); //      CN42, province
    }                                                //      CN42.., city
    
    mapSelectorEventEmitter.emit("region-selected", filterRegionId);

    filterRegion(filterRegionId, function(target){
        target.setStyle({ fillOpacity: 0.2 });
    }, function(nonTarget){
        nonTarget.setStyle({ fillOpacity: 0 });
    });
}

function bindEventsToFeature(feature, layer){
    // on each feature in this GeoJSON is created and styled
    regionFilterCallbacks.push(regionFilterFactory(
        feature.properties.id,
        layer
    ));
    layer.on("click", function(e){
        onRegionClicked(e.target.feature);
        e.originalEvent._proceeded = true; // tell map level filter ignore
        e.originalEvent.preventDefault();
    });
}

/* Adds cities onto map. Style and bind events. */

for(var provinceId in CHINA){
    CHINA[provinceId].features.forEach(function(feature){
        feature.properties.id = "CN" + feature.properties.id.toString();
        regionsAsFeaturesById[feature.properties.id] = feature;
    });
    provinces[provinceId] = L.geoJSON(CHINA[provinceId], {
        onEachFeature: bindEventsToFeature,
        style: function(){ return {
            color: "#ffffff",
            weight: 1,
            opacity: 0.2,
            fillOpacity: 0,
        } },
    }).addTo(map);
}

map.on("click", function(e){
    if(e.originalEvent._proceeded){
        return; // if marked as proceeded by region filter
    }
    filterRegion(
        "*****", // select the whole world. clear all region markers.
        function(target){},
        function(nonTarget){
            nonTarget.setStyle({ fillOpacity: 0 });
        }
    );
    mapSelectorEventEmitter.emit("region-selected", "world");
});


return {
    regionSelector: mapSelectorEventEmitter, // events emitter
    heatmap: heatmap,                        // heatmap layer to play with
    regionsAsFeaturesById: regionsAsFeaturesById,
                        // look up dict for region features(GeoJSON objects)
}
//////////////////////////////////////////////////////////////////////////////
});
