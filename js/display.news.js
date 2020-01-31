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
    
    var pick = allNews[Math.floor(Math.random() * allNews.length)];

    $(".headline-marquee").text(pick.title).marquee();

};

rotateNews();
setInterval(rotateNews, 15000);





//////////////////////////////////////////////////////////////////////////////
});
