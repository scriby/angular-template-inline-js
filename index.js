var fs = require('fs');
var path = require('path');
var minify = require('html-minifier').minify;

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
    '([\'"]?\\s*[:=])' + //Optionally followed by a single or double quote, then a colon (templateUrl: or 'templateUrl':, etc.)
    '\\s*[\'"]' + //Optional whitespace, then a single or double quote to indicate a string literal
    '([^\'"]+)' + //The template path
    '[\'"]', //Closing single or double quote
     'g' //Match multiple occurrences within the source
  );

  var compiledTemplateRegex = /template([\'"]?\s*[:=]) \('(.*)', '.*' \+ ''\)/g;

  var readTemplate = function (templatePath) {
  	return fs.readFileSync(path.join(options.basePath, templatePath), 'utf8');
  };

  var handleMatch = function(match, endCharAndColon, templatePath) {
    var contents;

  	try {
    	contents = readTemplate(templatePath);
    	if (options.minify.useHtmlMin) {
			contents = minify(contents, options.minify.options);
		}
    } catch(e) {
      console.error(e);
      return match; //Leave it as-is if the referenced file doesn't exist
    }

    //We add "+ ''" to the end to help the regex determine where the template string ends
    return 'template' + endCharAndColon + " ('" + templatePath + "', '" + escapeContents(contents) + "' + '')";
  };

  //Update references in code that look something like { templateUrl: './index.html' }
  var compiled = src.replace(compiledTemplateRegex, handleMatch);

  //Update references in code for templates that were previously inlined
  compiled = compiled.replace(templateUrlRegex, handleMatch);

  return compiled;
};