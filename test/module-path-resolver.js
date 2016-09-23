var assert = require('assert');
var path = require('path');

describe('ModulePathResolver', function(){
  it('shoulds return proper absolue path', function(){


    // @todo create one instance
    var ModulePathResolver = require('../lib/module-path-resolver');
    var mPR = new ModulePathResolver(__dirname);

    assert.equal('/some-absolute-module', mPR.resolve('/some-absolute-module'))
  });

  it('shoulds return proper relative path', function(){

    var ModulePathResolver = require('../lib/module-path-resolver');
    var mPR = new ModulePathResolver(__dirname);
    var expected = path.join(__dirname, 'test-relative-module');

    assert.equal(expected, mPR.resolve('./test-relative-module'))
  });

  it('shoulds return proper global path', function(){

    var ModulePathResolver = require('../lib/module-path-resolver');
    var mPR = new ModulePathResolver(__dirname);
    var expected = require.resolve('util');

    assert.equal(expected, mPR.resolve('util'))
  });

});
