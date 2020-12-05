#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const remove = require('rimraf');
const config = JSON.parse(fs.readFileSync('config.json').toString());
const compile = require('./compiler.js');
console.log("Compiling Site");

remove.sync(path.join(process.cwd(), config.output));
mkdirp(config.output);

(async() => {
    try {
        await compile.folder('/', config);
    } catch (e) {
        console.log('\n\n\n\nOops, something went wrong.\n', e);
    }
    console.log("\nDone!");
})();