var handlebars = require('handlebars');
var fs = require('fs');

var partialsDir = __dirname + '/../../template/partials';

var filenames = fs.readdirSync(partialsDir);

filenames.forEach(function (filename) {
  var matches = /^([^.]+).html$/.exec(filename);
  if (!matches) {
    return;
  }
  var name = matches[1];
  var template = fs.readFileSync(partialsDir + '/' + filename, 'utf8');
  handlebars.registerPartial(name, template);
});