#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const shell = require('shelljs');
let destDir = process.cwd();

function copy(srcDir, dstDir) {
    let results = [];
    let list = fs.readdirSync(srcDir);
    let src, dst;

    function skip(file) {
        return /.*node_modules.*/.test(file) || /.env$/.test(file)
            || /package-lock.json$/.test(file)
    }``

    list.forEach(function(file) {
        src = srcDir + '/' + file;
        dst = dstDir + '/' + file;

        if (skip(file)) {
            return;
        }

        let stat = fs.statSync(src);
        if (stat && stat.isDirectory()) {
            try {
                console.log('creating dir: ' + dst);
                fs.mkdirSync(dst);
            } catch(e) {
                console.log('directory already exists: ' + dst);
            }
            results = results.concat(copy(src, dst));
        } else {
            try {
                console.log('copying file: ' + dst);
                fs.writeFileSync(dst, fs.readFileSync(src));
            } catch(e) {
                console.log('could\'t copy file: ' + dst);
            }
            results.push(src);
        }
    });
    return results;
}

let stubDir = __dirname;
let stub = path.join(stubDir, "app/.");

copy(stub, destDir);
shell.exec('npm install');