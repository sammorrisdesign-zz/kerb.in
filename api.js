var request = require('request');
var cheerio = require('cheerio');

var url = "http://www.kerbfood.com/kings-cross/";

request({
	"uri": url
	}, function(err, resp, body){
		var $ = cheerio.load(body);
		
		// Create Structure for data
		var output = {};
		
		// Target panel on Kerb website
		$(".rota_panel > ul > li").each(function(index) {
			output[index] = {};
			output[index]["date"] = $(this).attr("rel");
			
			$(this).find("ul li").each(function(subIndex) {
			
				subIndex = "stand-" + subIndex;
				output[index][subIndex] = {};
				output[index][subIndex]["standName"] = $(this).find("h4 a").text();
				output[index][subIndex]["href"] = $(this).find("h4 a").attr("href");
				output[index][subIndex]["image"] = $(this).find("a > img").attr("src");
				output[index][subIndex]["description"] = $(this).find("p").text();
				
			});
			
		});
		
	// Convert to json
	output = JSON.stringify(output, null, 4);
	// console.log(output);
	console.log("Hi");
}); 