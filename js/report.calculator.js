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

//console.log(regionData);


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


const CNProvinceIDs = [];
for(var i in CHINASTRUCT.prefix) CNProvinceIDs.push(CHINASTRUCT.prefix[i]);

function getStatistic(date, region){
    var regions = [];
    if(region.length == 2){
        if(region == "CN"){
            regions = CNProvinceIDs;
        } else {
            return {unknown: true, infected: 0, death: 0};
        }
    } else {
        regions = [region];
    }

    var infected = 0, death = 0;
    regions.forEach(function(eachRegion){
        if(!regionData[eachRegion]){
            console.debug(eachRegion, "not found");
            return;
        }
        infected += findNearestIn(date, regionData[eachRegion].infected) || 0;
        death += findNearestIn(date, regionData[eachRegion].death) || 0;
    });

    return { infected: infected, death: death }
}


return getStatistic;
//////////////////////////////////////////////////////////////////////////////
});
