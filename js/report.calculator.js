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


function findNearestIn(date, dataSeries){
    date = date.getTime() / 3600000;
    const hours = [];
    const diffs = [];
    var min = 9999999;
    for(var time in dataSeries){
        hours.push(time);
        if(date >= time){
            diffs.push(date - time);
            if(date-time < min) min = date - time;
        } else {
            diffs.push(0);
        }
    }
    var i = hours[diffs.indexOf(min)];
    return dataSeries[i];
}



function getStatistic(date, region){
    const targetDataSeries = regionData[region];
    if(!targetDataSeries) return {unknown: true, infected: 0, death: 0};

    return {
        infected: findNearestIn(date, targetDataSeries["infected"]) || 0, 
        death: findNearestIn(date, targetDataSeries["death"]) || 0,
    }
}


return getStatistic;
//////////////////////////////////////////////////////////////////////////////
});
