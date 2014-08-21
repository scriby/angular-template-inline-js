var assert = require('assert');
var compiler = require('../../index.js');
var fs = require('fs');

describe('angular-template-inline-js', function(){
  var basePath = __dirname + '/../samples/';

  it('should compile a simple template', function(){
    var compiled = compiler.compile(
      fs.readFileSync(basePath + '/simple.js', 'utf8'),
      { basePath: basePath }
    );

    assert.equal(compiled, "{ template: '<!--template path: ./simple.html-->\\nsimple contents\\n<!--end template-->' }");
  });

  it('should compile a template with quotes', function(){
    var compiled = compiler.compile(
      fs.readFileSync(basePath + '/quote.js', 'utf8'),
      { basePath: basePath }
    );

    assert.equal(compiled, "{ \"template\": '<!--template path: ./quote.html-->\\nquote contents\\n<!--end template-->' }");
  });

  it('should compile a template using a specified key name', function(){
    var compiled = compiler.compile(
      fs.readFileSync(basePath + '/named.js', 'utf8'),
      { key: 'inlineTemplate', basePath: basePath }
    );

    assert.equal(compiled, "{ template: '<!--template path: ./named.html-->\\nnamed contents\\n<!--end template-->' }");
  });

  it('should escape template contents', function(){
    var compiled = compiler.compile(
      fs.readFileSync(basePath + '/escape.js', 'utf8'),
      { basePath: basePath }
    );

    assert.equal(compiled, "{ template: '<!--template path: ./escape.html-->\\nescape\\ncontents\\n\\'\\n\\\\\\n<!--end template-->' }");
  });

  it('should compile multiple templates in one file', function(){
    var compiled = compiler.compile(
      fs.readFileSync(basePath + '/multi.js', 'utf8'),
      { basePath: basePath }
    );

    assert.equal(compiled, "var a = { template: '<!--template path: ./multi.html-->\\nmulti contents\\n<!--end template-->' }; var b = { template: '<!--template path: ./multi.html-->\\nmulti contents\\n<!--end template-->' };");
  });

  it('should compile a template twice', function(){
    var compiled = compiler.compile(
      fs.readFileSync(basePath + '/double.js', 'utf8'),
      { basePath: basePath }
    );

    assert.equal(compiled, "{ template: '<!--template path: ./double.html-->\\ndouble contents\\n<!--end template-->' }");
  });
});