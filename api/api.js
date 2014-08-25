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
var url = "http://www.kerbfood.com/kings-cross/";

// console.log(request);
// console.log(cheerio);
// console.log(descriptions);

request({
"uri": url
}, function(err, resp, body){
    var $ = cheerio.load(body);

    // Create Structure for data
    var output = {};
    output["lastUpdated"] = Date();

    // Target panel on Kerb website
    $(".rota_panel > ul > li").each(function(index) {
        index = "date-" + index;
        output[index] = {};
        output[index]["date"] = $(this).attr("rel");
        output[index] = [];

        $(this).find("ul li").each(function(subIndex) {
            var handle = $(this).find("h4 a").attr("href").replace("/traders/", "").replace("/", "");
            var seller = {};
            seller["handle"] = handle;
            seller["standName"] = $(this).find("h4 a").text().replace(" (inKERBating)", "").replace(" - Seychelles Kitchen", "");
            if (descriptions[handle] != void(0)) {
                seller["description"] = descriptions[handle];
            } else {
                seller["description"] = $(this).find("p").text();
            }
            seller["href"] = $(this).find("h4 a").attr("href");
            seller["image"] = $(this).find("a > img").attr("src");
            output[index].push(seller);
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
});

var port = process.env.PORT || 5000;