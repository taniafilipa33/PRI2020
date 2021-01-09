var http = require('http')
var meta = require('./my-mode')

var servidor = http.createServer(function(req, res) {
    res.writeHead(200, { 'Content-type': 'text/plain;charset=utf-8' });
    res.write("Criada com o node.js por " +
    meta.myName() + " em " + meta.myDateTime() + 
    " de " + meta.instituicao)
    res.end()
})

servidor.listen(7777)

console.log('Servidor à escuta na porta 7777...')