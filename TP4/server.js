var http = require("http");
var fs = require("fs");

var servidor = http.createServer(function (req, res) {
  if (req.url == "/" || req.url == "/arqs/*") {
    fs.readFile("arqweb/index.html", function (err, data) {
      if (err) {
        console.log("" + err);
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write("Error: Falha a ler o ficheiro");
        res.end();
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        res.end();
      }
    });
  } else {
    if (req.url != "/favicon.ico" ) {
      fs.readFile("arqweb/arqs" + req.url, function (err, data) {
        if (err) {
          console.log("" + err);
          res.writeHead(200, { "Content-Type": "text/html" });
          res.write("Error: Falha a ler o ficheiro");
          res.end();
        } else {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.write(data);
          res.end();
        }
      });
    }
  }
});

servidor.listen(7777);
console.log("Waiting on port 7777...");
