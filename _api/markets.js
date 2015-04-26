// Required Modules
var request = require('request');
var cheerio = require('cheerio');
var fs = require("fs");

// External Sources
var source = "http://www.kerbfood.com/kings-cross/";

// Options
var url = "http://www.kerb.in";

request({
"uri": source
}, function(err, resp, body){
    var $ = cheerio.load(body);
    var output = {};
    output["markets"] = [];
    output["url"] = url;

    // Target panel on Kerb website
    $("#nav_trader_map ul li").each(function(index) {
        var market = {};
        market["name"] = $(this).text();
        market["handle"] = $(this).find("a").attr("href").replace(/\//g, "");
        market["uri"] = "http://www.kerbfood.com" + $(this).find("a").attr("href");
        market["localUrl"] = url + $(this).find("a").attr("href");
        if (market["handle"] !== "kerb-does-alchemy") {
            output["markets"].push(market);
        }
    });

    // Output file
    fs.writeFile("markets.json", JSON.stringify(output), function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Json Written");
        }
    });
});

var port = process.env.PORT || 5000;