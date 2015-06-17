// Required Modules
var request = require('request');
var cheerio = require('cheerio');
var handlebars = require("handlebars");
var fs = require("fs");

// Helpers
var getHandlebarsPartials = require("./helpers/getHandlebarsPartials");

// External Sources
require.extensions['.html'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

var html = require("../_template/market.html");
var descriptions = require("./descriptions.json");
var sources = require("./markets.json");

// Options
var jsonExport = true;
var forceToday = false; // This allows for development when working on non-Kerb days
if (process.env.ENV == "local") {
    var url = "http://localhost:3000";
} else {
    var url = "http://www.kerb.in";
}

sources["markets"].forEach(function(source) {
    request({
    "uri": source["uri"]
    }, function(err, resp, body){
        var $ = cheerio.load(body);

        // Create Structure for data
        var output = {};
        output["lastUpdated"] = new Date();
        output["todaysDate"] = null;
        output["url"] = url;
        output["marketName"] = $(".col_left h3:first-of-type").text();
        output["marketHandle"] = source["handle"];
        output["isClosed"] = true;
        output["hasDates"] = true;
        output['markets'] = [];

        // Add Today's Date
        function suffixOf(i) {
            var j = i % 10,
                k = i % 100;
            if (j == 1 && k != 11) {
                return i + "st";
            }
            if (j == 2 && k != 12) {
                return i + "nd";
            }
            if (j == 3 && k != 13) {
                return i + "rd";
            }
            return i + "th";
        }

        var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var today = dayNames[output["lastUpdated"].getDay()] + " " +
                    suffixOf(output["lastUpdated"].getDate()) + " " +
                    monthNames[output["lastUpdated"].getMonth()] + " " +
                    output["lastUpdated"].getFullYear();

        output["todaysDate"] = today;

        // Target panel on Kerb website and loop through each day
        $(".rota_panel > ul > li").each(function(index) {
            market = {};
            market["traders"] = [];
            market["date"] = $(this).attr("rel");
            market["timestamp"] = $(this).attr("id").replace("date-", "");
;
            var numOfTraders = $(this).find("ul li").length;

            // Loop through each trader
            $(this).find("ul li").each(function(subIndex) {
                var handle = $(this).find("h4 a").attr("href").replace("/traders/", "").replace("/", ""),
                    trader = {};

                if (handle == 'noble-espresso') {
                    return;
                }

                // Sort out the data
                trader["handle"] = handle;
                trader["standName"] = $(this).find("h4 a").text().replace(" (inKERBating)", "").replace(" - Seychelles Kitchen", "");
                if (descriptions[handle] != void(0)) {
                    trader["description"] = descriptions[handle];
                } else {
                    trader["description"] = "";
                }
                trader["href"] = $(this).find("h4 a").attr("href");
                trader["image"] = $(this).find("a > img").attr("src");
                if (fs.existsSync("../_illustrations/" + handle + ".svg")) {
                    trader["illustration"] = "../_illustrations/" + handle + ".svg";
                } else {
                    trader["illustration"] = "../_illustrations/generic.svg";
                }
                if (numOfTraders - 1 == subIndex) {
                    trader["last"] = true;
                }
                market["traders"].push(trader);
            });

            if (market.traders.length > 0) {
                output['markets'].push(market);
            }
        });

        if (output.markets.length < 2) {
            output.hasDates = false;
        }

        if (output.markets.length == 0) {
            delete output.markets;
        } else if (output.markets.length > 0 && output.markets[0].date == today) {
            output["isClosed"] = false;
        }

        // Create Folder
        if (!fs.existsSync("../" + source["handle"])) {
            fs.mkdir('../' + source["handle"], function (err) {
                if (err) {
                    throw err;
                } else {
                    console.log("Folder created for " + source["handle"]);
                }
            });
        }

        // Compile html using template.html
        var template = handlebars.compile(html);
        var result = template(output);

        // Output file
        fs.writeFile("../" + source["handle"] + "/index.html", result, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("File Written");
            }
        });

        if (jsonExport == true) {
            fs.writeFile("../" + source["handle"] + "/api.json", JSON.stringify(output), function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Json Written");
                }
            });
        }
    });
});

var port = process.env.PORT || 5000;