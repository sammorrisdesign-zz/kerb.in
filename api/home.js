// Required Modules
var request = require('request');
var cheerio = require('cheerio');
var handlebars = require("handlebars");
var fs = require("fs");

// External Sources
require.extensions['.html'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
var html = require("../template/home.html");
var markets = require("./markets.json");

// Compile html using template.html
var template = handlebars.compile(html);
var result = template(markets);

// Output file
fs.writeFile("../index.html", result, function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log("File Written");
    }
});

var port = process.env.PORT || 5000;