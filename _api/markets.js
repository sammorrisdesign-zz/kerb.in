// Required Modules
var request = require('request');
var cheerio = require('cheerio');
var fs = require("fs");

// External Sources
var source = "http://www.kerbfood.com/kings-cross/";

// Options
var vans = ["luardos", "hanoi-kitchen", "yu-kyu", "the-grilling-greek", "motoyogo", "baba-g-s", "bbq-lab", "kimchinary", "rainbo", "spit-roast", "well-kneaded"];
var whiteList = ["kerb-on-the-quay", "gherkin", "kings-cross", "spitalfields", "paddington", "uclu-monthly-"];
if (process.env.ENV == "local") {
    var url = "http://localhost:3000";
} else {
    var url = "http://www.kerb.in";
}

request({
"uri": source
}, function(err, resp, body){
    var $ = cheerio.load(body);
    var output = {};
    output["markets"] = [];
    output["vans"] = [];
    output["url"] = url;

    // Target panel on Kerb website
    $("#nav_trader_map ul li").each(function(index) {
        var market = {};
        market["name"] = $(this).text();
        market["handle"] = $(this).find("a").attr("href").replace(/\//g, "");
        market["uri"] = "http://www.kerbfood.com" + $(this).find("a").attr("href");
        market["localUrl"] = url + $(this).find("a").attr("href");
        if (whiteList.indexOf(market["handle"]) > -1) {
            output["markets"].push(market);
        }
    });

    // Get van illustrations
    $(vans).each(function(index, value) {
        var van = {};
        van["name"] = value;
        fs.readFile('../_illustrations/' + value + '.svg', 'utf8', function(err, data) {
            van["illustration"] = data;
            output["vans"].push(van);
            if (index == vans.length -1) {
                fs.writeFile("markets.json", JSON.stringify(output), function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Json Written");
                    }
                });
            }
        });

    });

});

var port = process.env.PORT || 5000;