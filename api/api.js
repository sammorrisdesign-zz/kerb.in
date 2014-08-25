// Required Modules
var request = require('request');
var cheerio = require('cheerio');
var fs = require("fs");

// External Sources
var descriptions = require("./descriptions.json");
var url = "http://www.kerbfood.com/kings-cross/";

console.log(request);
console.log(cheerio);
console.log(descriptions);
console.log(descriptions["bbq-lab"].length);

request({
"uri": url
}, function(err, resp, body){
    var $ = cheerio.load(body);

    // Create Structure for data
    var output = {};
    output["lastUpdated"] = Date();

    // Target panel on Kerb website
    $(".rota_panel > ul > li").each(function(index) {
        output[index] = {};
        output[index]["date"] = $(this).attr("rel");

        $(this).find("ul li").each(function(subIndex) {
            var handle = $(this).find("h4 a").attr("href").replace("/traders/", "").replace("/", "");
            subIndex = "stand-" + subIndex;
            output[index][subIndex] = {};
            output[index][subIndex]["handle"] = handle;
            output[index][subIndex]["standName"] = $(this).find("h4 a").text().replace(" (inKERBating)", "").replace(" - Seychelles Kitchen", "");
            if (descriptions[handle] != void(0)) {
                output[index][subIndex]["description"] = descriptions[handle];
            } else {
                output[index][subIndex]["description"] = $(this).find("p").text();
            }
            output[index][subIndex]["href"] = $(this).find("h4 a").attr("href");
            output[index][subIndex]["image"] = $(this).find("a > img").attr("src");

        });
    });

    // Convert to json
    output = JSON.stringify(output, null, 4);

    // Output file
    fs.writeFile("api.json", output, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("File Written");
        }
    });
});

var port = process.env.PORT || 5000;