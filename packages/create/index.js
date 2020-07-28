#!/usr/bin/env node

const path = require('path');
const REPO_NAME = 'app';
const VERSION = '3.0.0-dev.29';
const EXTRACT_DIR = `${REPO_NAME}-${VERSION}`;
let archiveUrl = `https://github.com/drafterbit/app/archive/${VERSION}.zip`;
let dirDest = process.cwd();
let fileDest = `./drafterbit-app-${VERSION}.zip`;


const { https } = require('follow-redirects');
const fs = require('fs');
const unzip = require('unzip-stream');
const mkdirp = require('mkdirp');
const shell = require('shelljs');

// Download
console.log("Downloading from", archiveUrl);
const download = function(url, dest, cb) {
    let request = https.get(url, res => {
        res.pipe(unzip.Parse())
            .on("finish", function () {
                cb();
            })
            .on('entry', function (entry) {
                let filePath = entry.path.replace(EXTRACT_DIR, "");
                if (filePath !== "") {
                    let isDir     = 'Directory' === entry.type;
                    let fullPath = path.join(dirDest, filePath);
                    let directory = isDir ? fullPath : path.dirname(fullPath);

                    mkdirp.sync(directory);
                    if (! isDir) { // should really make this an `if (isFile)` check...
                        console.log("creating file", fullPath);
                        entry.pipe(fs.createWriteStream(fullPath));
                    } else {
                        entry.autodrain();
                    }
                }
            })
    })
};

download(archiveUrl, fileDest, function (e) {
    install()
});

function install() {
    // shell.cd(process.cwd());
    setTimeout(() => {
        shell.exec('npm install');
    }, 1000);
}

// Extract
// Npm install
