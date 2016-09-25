var assert = require('assert');

describe('drafterbit', function(){

    describe('load method', function(){
        it('should throw error if no registerModules defined', function(){

            var drafterbitApp = require('../lib/index')();
            assert.throws(drafterbitApp.load, Error);
        });

        it('should throw error if no config file', function(){

          var drafterbitApp = require('../lib/index')();
            drafterbitApp.registerModules = function() { return [] };
            assert.throws(drafterbitApp.load, Error);
        });

    });
});
