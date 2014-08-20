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
     'g' //Match multiple occurrences within the source
  );

  var compiledTemplateRegex = /template([\'"]?:) '<!--template path: (.+)-->.*<!--end template-->'/g;

  var readTemplate = function(templatePath) {
    return fs.readFileSync(path.join(options.basePath, templatePath), 'utf8');
  };

  var handleMatch = function(match, endCharAndColon, templatePath) {
    var contents = readTemplate(templatePath);

    return 'template' + endCharAndColon +
      " '<!--template path: " + templatePath + '-->\n' +
      escapeContents(contents) +
      "\n<!--end template-->'";
  };

  //Update references in code that look something like { templateUrl: './index.html' }
  var compiled = src.replace(templateUrlRegex, handleMatch);

  //Update references in code for templates that were previously inlined
  compiled = compiled.replace(compiledTemplateRegex, handleMatch);

  return compiled;
};