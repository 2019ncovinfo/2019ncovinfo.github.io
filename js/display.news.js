define([
    "lib/jquery.marquee"
], function(){
//////////////////////////////////////////////////////////////////////////////
const allNews = [];

NEWS_UNCOMPILED.split(/\-{20,40}/).forEach(function(news){
    
    var lines = news.trim().split("\n");
    var headline = lines[0], body = lines.slice(1).join("\n").trim();

    var headlineParts = headline.trim().split(/\s+/);

    var date = new Date(headlineParts[0]),
        title = headlineParts[1].trim();
        options = headlineParts.slice(2);


    allNews.push({date: date, title: title, options: options, body: body});
});

allNews.sort((a,b)=>(b.date.getTime() > a.date.getTime()));



function rotateNews(){
    const nowtime = new Date().getTime();
    var pickList = [];
    var weightSum = 0, weight = 1, timeDiff = 0, pickWeight=0;
    for(var i in allNews){
        timeDiff = (nowtime - allNews[i].date.getTime()) / 3600000; // hrs
        if(timeDiff > 24 || timeDiff < 0) continue;
        weight = 1;
        if(timeDiff < 12){
            weight = 2;
        } else if(timeDiff < 6) {
            weight = 4;
        } else if(timeDiff < 3){
            weight = 8;
        }
        weightSum += weight;
        pickList.push([i, weightSum]);
    }
    pickList.sort((a,b)=>(a[1] < b[1]));

    if(pickList.length > 0){
        pickWeight = Math.random() * weightSum;
        for(var i=0; i<pickList.length; i++){
            if(pickList[i][1] > pickWeight) break;
        }
        var pick = allNews[pickList[i][0]]; 
        $(".headline-marquee").text(pick.title).marquee();
    } else {
        $(".headline-marquee").text("")
    }

};

rotateNews();
setInterval(rotateNews, 15000);





//////////////////////////////////////////////////////////////////////////////
});
