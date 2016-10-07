var assert = require('assert');
var express = require('express');

describe('nunjucks module loader', function(){
    it('should return proper results', function(){

        var nunjucksModuleLoader = require('./../../lib/nunjucks/module-loader');

        var apps = [require('./../../lib/modules/desk')];
        var i = new nunjucksModuleLoader(apps);

        assert.equal(null, i.getSource('dont-exists.html'));

    });
});
