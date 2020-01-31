function decideMagnitude(n){
    if(n < 2) return 0.1;
    else if(n < 10) return 0.3;
    else if(n < 20) return 0.5;
    else if(n < 50) return 0.7;
    else return 1.0;

}




define([
    "data.china.struct",
    "map.china",
    "report.calculator",
], function(
    CHINASTRUCT,
    mapOperator,
    getStatistic
){
//////////////////////////////////////////////////////////////////////////////

const regionsAsFeaturesById = mapOperator.regionsAsFeaturesById;

const numbersInRegions = {};

function updateAtomRegionNumbers(date){
    for(var k in mapOperator.regionsAsFeaturesById){
        numbersInRegions[k] = getStatistic(date, k);
    }
}
updateAtomRegionNumbers(new Date());

//console.log(mapOperator.regionsAsFeaturesById);
//console.log(numbersInRegions);



var displaying = {
    regionId: "world",
    time: new Date(),
}


const regionSelector = mapOperator.regionSelector;
const heatmap = mapOperator.heatmap;

const province2name = {
    "world": "世界",
    "CN": "中国",
};

for(var province in CHINASTRUCT.prefix){
    province2name[CHINASTRUCT.prefix[province]] = province;
}



function refresh(){
    const statistic = getStatistic(displaying.time, displaying.regionId);
    $("#var-region").text(province2name[displaying.regionId]);
    $("#var-death").text(statistic.unknown ? "---" : statistic.death);
    $("#var-infected").text(statistic.unknown ? "---" : statistic.infected);

    
}




regionSelector.on("region-selected", function(regionId){
    displaying.regionId = regionId;
    refresh();
});

refresh();


var latlng = [];
for(var k in numbersInRegions){
    if(k.length <= 5) continue;
    const region = regionsAsFeaturesById[k];
    const number = numbersInRegions[k].infected;

    if(region.properties.cp){
        latlng = region.properties.cp;
    } else {
        continue;
        latlng = region.geometry.coordinates[0][0];
    }

    if(!number) continue;
    console.log(number, decideMagnitude(number));
    heatmap.addLatLng([latlng[1],latlng[0],decideMagnitude(number)]);
}

//////////////////////////////////////////////////////////////////////////////
});
