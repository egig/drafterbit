var assert = require('assert');
var express = require('express');

describe('drafterbit', function(){

    describe('theme manager', function(){

        it('should be able to hold themes', function(){

          var ThemeManager = require('../lib/theme-manager');
          var tM = new ThemeManager(__dirname);

          assert.equal(0, tM.getThemes().length);

        });

        it('should be able to add theme path', function(){
          var ThemeManager = require('../lib/theme-manager');
          var tM = new ThemeManager(__dirname);

          var T = require('./test-theme');
          var t = new T();

          var thName = t.getName();

          tM.addThemePath('./test-theme');
          var theme = tM.getTheme(thName);

          assert.equal(thName, theme.getName());

        })
    });

});
