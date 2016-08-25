var assert = require('assert');
var express = require('express');

describe('drafterbit', function(){

    /* @todo mock object
    describe('#boot', function(){
        it('should not error', function(){

            var app = express();
            var drafterbit = require('../modules/drafterbit')(__dirname, app);

            assert.equal(true, drafterbit.boot());
        });
    });*/

    describe('nunjucks module loader', function(){
        it('should return proper results', function(){

            var nunjucksModuleLoader = require('../nunjucks/module-loader');

            var apps = [require('../modules/desk')];
            var i = new nunjucksModuleLoader(apps);

            assert.equal(null, i.getSource('dont-exists.html'));

        });
    });

});
