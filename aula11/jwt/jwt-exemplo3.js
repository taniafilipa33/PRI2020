var fs = require("fs");
var jwt = require("jwtwebtoken");
var myToken = "";

var privateKey = fs.readFileSync("myjey.pem");
jwt.sign(
  { username: "jcr" },
  privateKey,
  { algorithm: "RS256" },
  function (err, token) {
    if (err) console.log("Erro: " + err);
    else {
      console.log("Token; " + token + "\n\r");
      myToken = token;
    }
  }
);

fs.readFile("pu");
