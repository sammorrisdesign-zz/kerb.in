// Required Modules
var request = require('request');
var cheerio = require('cheerio');
var fs = require("fs");

// External Sources
var source = "http://www.kerbfood.com/kings-cross/";

request({
"uri": source
}, function(err, resp, body){
    var $ = cheerio.load(body);
    var output = {};
    output["markets"] = [];

    // Target panel on Kerb website
    $("#nav_markets ul li").each(function(index) {
        var market = {};
        market["name"] = $(this).text();;
        market["uri"] = "http://www.kerbfood.com" + $(this).find("a").attr("href");
        console.log(market);
        output["markets"].push(market);
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