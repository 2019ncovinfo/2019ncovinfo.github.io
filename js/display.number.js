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

const numbersInRegions = {};
for(var k in mapOperator.regionsAsFeaturesById){
    numbersInRegions[k] = 0;
}

console.log(mapOperator.regionsAsFeaturesById);



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

heatmap.addLatLng([10,100,0.5]); // test
heatmap.addLatLng([12,100,0.8]); // test

//////////////////////////////////////////////////////////////////////////////
});
