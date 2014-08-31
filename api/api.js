// Required Modules
var request = require('request');
var cheerio = require('cheerio');
var handlebars = require("handlebars");
var fs = require("fs");

// External Sources
require.extensions['.html'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
var html = require("../template/template.html");
var descriptions = require("./descriptions.json");
var source = "http://www.kerbfood.com/kings-cross/";

// Options
var jsonExport = true;
var url = "http://www.kerb.in";

request({
"uri": source
}, function(err, resp, body){
    var $ = cheerio.load(body);

    // Create Structure for data
    var output = {};
    output["lastUpdated"] = Date();
    output["url"] = url;

    // Target panel on Kerb website
    $(".rota_panel > ul > li").each(function(index) {
        index = "date-" + index;
        output[index] = {};
        output[index]["traders"] = [];
        output[index]["date"] = $(this).attr("rel");
        var numOfTraders = $(this).find("ul li").length;

        $(this).find("ul li").each(function(subIndex) {
            var handle = $(this).find("h4 a").attr("href").replace("/traders/", "").replace("/", "");
            var trader = {};
            trader["handle"] = handle;
            trader["standName"] = $(this).find("h4 a").text().replace(" (inKERBating)", "").replace(" - Seychelles Kitchen", "");
            if (descriptions[handle] != void(0)) {
                trader["description"] = descriptions[handle];
            } else {
                trader["description"] = $(this).find("p").text();
            }
            trader["href"] = $(this).find("h4 a").attr("href");
            trader["image"] = $(this).find("a > img").attr("src");
            if (numOfTraders - 1 == subIndex) {
                trader["last"] = true;
            }
            output[index]["traders"].push(trader);
        });
    });

    // Compile html using template.html
    var template = handlebars.compile(html);
    var result = template(output);
    // Output file
    fs.writeFile("../index.html", result, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("File Written");
        }
    });

    if (jsonExport == true) {
        fs.writeFile("api.json", JSON.stringify(output), function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Json Written");
            }
        });
    }
});

var port = process.env.PORT || 5000;