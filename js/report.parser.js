define([
    "data.china.struct",
], function(
    CHINASTRUCT
){
//////////////////////////////////////////////////////////////////////////////
/* A near natural language report parser.

Epidemic reports have following syntax, each in one line, for example:

1月23日24时，湖北省累计确诊 N 例，其中武汉 N 例，宜昌 N 例
1月23日24时，湖北省累计死亡 N 例，其中武汉 N 例
1月23日24时，湖北省新增确诊 N 例，其中武汉 N 例
1月23日24时，湖北省新增死亡 N 例，其中武汉 N 例
1月23日12时至1月23日24时，湖北省新增死亡 N 例，其中武汉 N 例
1月23日12时-1月23日24时，湖北省新增死亡 N 例，其中武汉 N 例
*/


function zerojust2(t){
    t = "0000" + t;
    return t.slice(-2);
}

function parsedate(spec){
    const dateparser = /(\d+)月(\d+)日((\d+)时)?/;
    const rangespec = spec.split(/[至\-]/);
    for(var i=0; i<rangespec.length; i++){
        const result = dateparser.exec(rangespec[i]);
        if(!result) throw Error("无法理解: " + spec);

        const month = result[1], day = result[2];
        const hour = (result[4] ? result[4] : '24');


        rangespec[i] = new Date(
            "2020-" + zerojust2(result[1]) + "-" + zerojust2(result[2]) +
            "T" + zerojust2(hour) + ":00+08:00").getTime() / 3600000; // hours
    }
    
    if(rangespec.length == 1){
        return [false, rangespec[0]];
    } else {
        return [rangespec[0], rangespec[1]]
    };
}

function parsemarker(spec){
    const result = /((全国|北京|天津|上海|重庆|河北|山西|内蒙古|辽宁|吉林|黑龙江|江苏|浙江|安徽|福建|江西|山东|河南|湖北|湖南|广东|广西|海南|重庆|四川|贵州|云南|西藏|新疆|陕西|甘肃|宁夏|青海|台湾|香港|澳门)(省|市|自治区|特别行政区)?)(新增|累计)(报告)?(确诊|死亡)(病例)?\s?(\d+)\s?例/.exec(spec);
    if(!result){
        throw Error("无法理解: " + spec);
    }
    if(result[2] != "全国" && CHINASTRUCT.struct[result[2]] == undefined){
        throw Error("未找到地区定义: " + result[2]);
    }
    return {
        region: result[2],
        regionId: (result[2] == '全国' ? "CN" : CHINASTRUCT.prefix[result[2]]), 

        sum: result[4] == "累计",
        delta: result[4] == "新增",
        infected: result[6] == "确诊",
        death: result[6] == "死亡",
        number: parseInt(result[8], 10),
    };
}

function parsecity(region, spec){
    const subregionDef = (region == "全国" ? CHINASTRUCT.prefix : CHINASTRUCT.struct[region]);
    const result = /([^0-9]+)(\d+)\s?例/.exec(spec);
    if(!result){
        throw Error("无法理解下属地区: " + spec);
    }
    var cityspec = result[1].trim();
    var regionId = null;
    var ignore = false;

    if(!subregionDef[cityspec]){
        var shortspec = cityspec;
        var found = false;
        for(var i=1; i<=2; i++){
            shortspec = shortspec.slice(0,-1);
            found = false;
            for(var j in subregionDef){
                if(j.slice(0,shortspec.length) == shortspec){
                    found = true;
                    break;
                }
            }
            if(found) break;
        }
        if(found){
            cityspec = shortspec;
        } else {
            ignore = true;
            console.warn("找不到城市: " + cityspec);
        }
    }
    if(!ignore) regionId = subregionDef[cityspec];

    return {
        ignore: ignore,
        region: result[1].trim(),
        number: parseInt(result[2], 10),
        regionId: regionId,
    };
}



function parseline(line){
    const splitted = line.split(/\s?[，,、。:：]\s?/);
    if(splitted.length < 2) return false;

    const datespec = parsedate(splitted[0]);
    const markerspec = parsemarker(splitted[1]);

    const details = splitted.slice(2);
    for(var i=0; i<details.length; i++){
        if(details[i].slice(0,2) == "其中"){
            details[i] = details[i].slice(2);
        }
        if(!details[i]) continue;
        details[i] = parsecity(markerspec.region, details[i].trim());
    }

    if(datespec[0] == false){
        // by default, time range - 24
        datespec[0] = datespec[1] - 24
    }

    return {
        time: datespec, // hours since epoch, [start, end]
        summary: markerspec,
        details: details,
    }

}

// ---------------------------------------------------------------------------

const allReports = [];
STAT_UNCOMPILED.split("\n").forEach(function(l){
    l = l.trim();
    if(!l) return;
    allReports.push(parseline(l));
});


return allReports;
//////////////////////////////////////////////////////////////////////////////
});
