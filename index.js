var fs = require('fs');
var path = require('path');

var escapeContents = function(contents) {
  return contents.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\r?\n/g, '\\n');
};

exports.compile = function(src, options) {
  options = options || {};

  if(!options.basePath) {
    throw new Error('options.basePath must be specified');
  }

  var key = options.key || 'templateUrl';

  var templateUrlRegex = new RegExp(
    key +
    '([\'"]?:)' + //Optionally followed by a single or double quote, then a colon (templateUrl: or 'templateUrl':, etc.)
    '\\s*[\'"]' + //Optional whitespace, then a single or double quote to indicate a string literal
    '([^\'"]+)' + //The template path
    '[\'"]', //Closing single or double quote
     'g'
  );

  var compiled = src.replace(templateUrlRegex, function(match, endCharAndColon, templatePath){
    var contents = fs.readFileSync(path.join(options.basePath, templatePath), 'utf8');

    return 'template' + endCharAndColon + " '" + escapeContents(contents) + "'";
  });

  return compiled;
};