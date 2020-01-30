(function(){

function locateDate(array, date){
    // returns index, where array[i] is immediate next to date
    date = date.getTime() / 3600000;
    var start = array[0].time[1];
    if(array.length == 1) return 0;
    for(var i=1; i<array.length; i++){
        if(start <= date && array[i].time[1] > date){
            return i-1;
        }
        start = array[i].time[1];
    }
    return i;
}




define([
    "data.china.struct",
    "report.parser"
], function(
    CHINASTRUCT,
    allReports
){
//////////////////////////////////////////////////////////////////////////////

const regionData = {
    "CN": { "infected": {}, "death": {} },
};
for(var province in CHINASTRUCT.struct){
    for(var city in CHINASTRUCT.struct[province]){
        regionData[CHINASTRUCT.struct[province][city]] = {
            "infected": {}, "death": {},
        };
    }
}
for(var province in CHINASTRUCT.prefix){
    regionData[CHINASTRUCT.prefix[province]] = {
        "infected": {}, "death": {},
    }
}

// Summarize allReports

const deltas = [];
const fixes = [];

allReports.forEach(function(each){
    if(each.summary.delta)
        deltas.push(each);
    else
        fixes.push(each);
});

fixes.forEach(function(fix){
    var type = fix.summary.infected ? "infected" : "death";
    regionData[fix.summary.regionId][type][fix.time[1]] = fix.summary.number;
    fix.details.forEach(function(detail){
        if(!detail || detail.ignore || !detail.regionId) return;
        regionData[detail.regionId][type][fix.time[1]] = detail.number;
    });
});

console.log(regionData);


function getStatistic(date, region){
        

}



return getStatistic;
//////////////////////////////////////////////////////////////////////////////
});

})();
