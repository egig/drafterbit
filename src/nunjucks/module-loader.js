'use strict';

const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');
const lib = require('nunjucks/src/lib');

// Node <0.7.1 compatibility
const existsSync = fs.existsSync || path.existsSync;

const ModuleLoader = nunjucks.FileSystemLoader.extend({
        async: false,

        init: function(modules, opts) {

            this.modules = modules;
            var opts = opts || {};
            var searchPaths = opts.paths || false;

            this.parent(searchPaths, opts);
        },

        getSource: function(name) {

            if(name.indexOf('@') === 0) {
                let tmp = name.split('/');
                let module = tmp.shift().substr(1);

                // @todo move this to module manager
                if(!this.modules[module]) {
                  throw Error("Unregistered module: '"+module+"'");
                }

                let basePath = this.modules[module].getViewPath();
                let fName =  tmp.join('/');

                let tempName = path.join(basePath, fName);
                if(!existsSync(tempName)) {
                  return null;
                }

                this.searchPaths.unshift(basePath);
                name = fName;
            }

            return this.parent(name);
        }

     });

 module.exports = ModuleLoader;
