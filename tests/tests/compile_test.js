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

    assert.equal(compiled, "{ template: ('./simple.html', 'simple contents') }");
  });

  it('should compile a template with quotes', function(){
    var compiled = compiler.compile(
      fs.readFileSync(basePath + '/quote.js', 'utf8'),
      { basePath: basePath }
    );

    assert.equal(compiled, "{ \"template\": ('./quote.html', 'quote contents') }");
  });

  it('should compile a template using a specified key name', function(){
    var compiled = compiler.compile(
      fs.readFileSync(basePath + '/named.js', 'utf8'),
      { key: 'inlineTemplate', basePath: basePath }
    );

    assert.equal(compiled, "{ template: ('./named.html', 'named contents') }");
  });

  it('should escape template contents', function(){
    var compiled = compiler.compile(
      fs.readFileSync(basePath + '/escape.js', 'utf8'),
      { basePath: basePath }
    );

    assert.equal(compiled, "{ template: ('./escape.html', 'escape\\ncontents\\n\\'\\n\\\\\') }");
  });

  it('should compile multiple templates in one file', function(){
    var compiled = compiler.compile(
      fs.readFileSync(basePath + '/multi.js', 'utf8'),
      { basePath: basePath }
    );

    assert.equal(compiled, "var a = { template: ('./multi.html', 'multi contents') }; var b = { template: ('./multi.html', 'multi contents') };");
  });

  it('should compile a template twice', function(){
    var compiled = compiler.compile(
      fs.readFileSync(basePath + '/double.js', 'utf8'),
      { basePath: basePath }
    );

    assert.equal(compiled, "{ template: ('./double.html', 'double contents') }");
  });
});