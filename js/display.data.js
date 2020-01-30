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

const regionSelector = mapOperator.regionSelector;
const mapPainter = mapOperator.painter;

const province2name = {
    "world": "世界",
    "CN": "中国",
};

for(var province in CHINASTRUCT.prefix){
    province2name[CHINASTRUCT.prefix[province]] = province;
}



regionSelector.on("region-selected", function(regionId){
    $("#var-region").text(province2name[regionId]);
    console.log(regionId);
});


//////////////////////////////////////////////////////////////////////////////
});
