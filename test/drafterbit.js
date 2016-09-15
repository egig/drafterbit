var assert = require('assert');
var express = require('express');

describe('drafterbit', function(){

    describe('boot method', function(){
        it('should throw error if no registerModules defined', function(){

            var app = express();
            var drafterbitApp = require('../src/drafterbit')(__dirname, app);
            assert.throws(drafterbitApp.boot, Error);
        });

        it('should throw error if no config file', function(){

            var app = express();
            var drafterbitApp = require('../src/drafterbit')(__dirname, app);
            drafterbitApp.registerModules = function() { return [] };
            assert.throws(drafterbitApp.boot, Error);
        });

    });
});
