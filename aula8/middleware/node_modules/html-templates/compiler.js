const fs = require('fs');
const path = require('path');
const sd = require('showdown');
const less = require('less');
const sass = require('sass');
const mkdirp = require('mkdirp');

const convert = new sd.Converter();

let file = null;
let config = null;
let folder = null;
let altername_files = null;

async function replaceAsync(str, regex, asyncFn) {
    const promises = [];
    str.replace(regex, (match, ...args) => {
        const promise = asyncFn(match, ...args);
        promises.push(promise);
    });
    const data = await Promise.all(promises);
    return str.replace(regex, () => data.shift());
}



const features = [];
// File Including
features.push({
    regex: /{include "(.*)"}/g,
    replacer: async(str, filename) => {
        let _file = file;
        let _config = config;
        let _folder = folder;
        let _altername_files = altername_files;
        let x = (await compileFile(path.join(config.templates, filename), config.templates, config)).file;
        file = _file;
        config = _config;
        folder = _folder;
        altername_files = _altername_files;
        return x;
    }
});

// Markdown
features.push({
    regex: /{markdown "(.*)"}/g,
    replacer: async(str, filename) => {
        return convert.makeHtml(fs.readFileSync(path.join(config.source, filename)).toString());
    }
});

// LESS
features.push({
    regex: /{less "(.*)"}/g,
    replacer: async(str, filename) => {
        let result = await new Promise(done => {
            less.render(fs.readFileSync(path.join(config.source, filename)).toString(), (x, y) => {
                if(x) throw 'bad';
                done(y.css);
            });
        });

        let newFile = filename.replace(/\.less$/, '.css');
        altername_files.push([newFile, result]);
        return `<link rel="stylesheet" href="${newFile}">`;
    }
});

// Sass
features.push({
    regex: /{sass "(.*)"}/g,
    replacer: async (str, filename) => {
        let result = await new Promise(done => {
            sass.render({ file: path.join(config.source, filename) }, function (err, result) {
                done(result.css);
            });
        });

        let newFile = filename.replace(/\.s(a|c)ss$/, '.css');
        altername_files.push([newFile, result]);
        return `<link rel="stylesheet" href="${newFile}">`;
    }
});
async function compileFile(_file, _folder, _config) {
    if(!_file.endsWith('.html')) {
        return {
            file: fs.readFileSync(_file),
            altername_files: []  
        };
    }
    console.log('Compiling ' + _file);
    file = _file;
    folder = _folder;
    config = _config;
    altername_files = [];
    let contents = fs.readFileSync(file).toString();
    for (let i = 0; i < features.length; i++) {
        const feat = features[i];
        contents = await replaceAsync(contents, feat.regex, feat.replacer);
    }
    features.reduce((string, feat) => string.replace(feat.regex, feat.replacer), contents)
    return {
        file: contents,
        altername_files
    }
}

async function compileFolder(folder, config) {
    mkdirp.sync(path.join(config.output, folder));
    let file_list = fs.readdirSync(path.join(config.source, folder));
    for (let i = 0; i < file_list.length; i++) {
        const x = file_list[i];
        if (x == 'templates') continue;
        if (fs.statSync(path.join(config.source, folder, x)).isDirectory()) {

            await compileFolder(path.join(folder, x), config);
            continue;
        }

        let result = await compileFile(path.join(config.source, folder, x), folder, config);
        fs.writeFileSync(path.join(config.output, folder, x), result.file);
        result.altername_files.forEach(file => {
            mkdirp.sync(path.join(config.output, path.dirname(file[0])));
            fs.writeFileSync(path.join(config.output, file[0]), file[1]);
        });
    }
}

module.exports = {
    file: compileFile,
    folder: compileFolder
}