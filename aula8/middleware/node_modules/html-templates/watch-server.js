#!/usr/bin/env node
const clientPayload = `const socket=new WebSocket('ws://'+location.hostname+':'+location.port);socket.addEventListener('message',function(a){'reload'==a.data&&location.reload()});`;
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const remove = require('rimraf');
const config = JSON.parse(fs.readFileSync('config.json').toString());
const compile = require('./compiler.js');
const WebSocket = require('ws');
const http = require('http');
const server = http.createServer(function (req, res) {
    if (fs.existsSync(path.join(config.output, req.url))) {
        if (fs.statSync(path.join(config.output, req.url)).isDirectory()) {
            if (fs.existsSync(path.join(config.output, req.url, 'index.html'))) {
                res.write('<script>'+clientPayload+'</script>');
                fs.createReadStream(path.join(config.output, req.url, 'index.html')).pipe(res);
            }
        } else {
            if(req.url.endsWith('.html')) res.write('<script>'+clientPayload+'</script>');
            fs.createReadStream(path.join(config.output, req.url)).pipe(res);
        }
    } else {
        res.statusCode = 404;
        res.write('not found');
        res.end();
    }
});
const wss = new WebSocket.Server({ server });
let connections = [];
wss.on('connection', function connection(ws) {
    connections.push(ws);
    ws.on('close', () => {
        connections = connections.filter(x => ws !== x);
    })
});

let delay;
let running = -1;
async function recopiler() {
    delay = undefined;
    running++;
    if (running > 1) return;
    console.log('Recompiling');
    try {
        remove.sync(path.join(process.cwd(), config.output));
        mkdirp(config.output);
        await compile.folder('/', config);
        connections.forEach(x => {
            x.send('reload');
        });
    } catch(e) {
        console.log('\n\n\n\n!!! oops they explodeded\n', e);
    }
    if (running > 0) {
        running = -1;
        await recopiler();
    } else {
        running = -1;
    }
}
function startDelay() {
    if(delay) clearTimeout(delay);
    delay = setTimeout(recopiler, 50);
}
function watchDirR(dir) {
    fs.readdirSync(dir)
        .map(n => path.join(dir, n))
        .filter(file => fs.statSync(file).isDirectory())
        .forEach(watchDirR);
    fs.watch(dir, startDelay);
}
watchDirR(config.source);

server.listen(8080);

var os = require('os');
var ifaces = os.networkInterfaces();
console.log('Listening On: ')
Object.keys(ifaces).forEach(function (ifname) {
    var alias = 0;

    ifaces[ifname].forEach(function (iface) {
        if ('IPv4' !== iface.family || iface.internal !== false) {
            // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
            return;
        }

        // this interface has only one ipv4 adress
        console.log("http://" + iface.address + ":8080/");

        ++alias;
    });
});

recopiler();