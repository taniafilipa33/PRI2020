var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");

var user = { username: "tnr", passwd: "123" };
/*
 O utilizador autentica-se com username e password
 Se as credenciais estiverem corretas é gerado um token e eviado como resposta
*/
router.post("/", function (req, res) {
  console.log(__dirname + "/../keys/mykey.pem");
  if (req.body.username == user.username && req.body.passwd == user.passwd) {
    var privateKey = fs.readFileSync(__dirname + "/../keys/mykey.pem");
    jwt.sign(
      { username: "tnr", level: "admin", sub: "aula de PRI" },
      privateKey,
      { algorithm: "RS256" },
      function (e, token) {
        if (e) res.status(500).jsonp({ erro: "erro na gerçção de token " + e });
        else {
          res.status(201).jsonp({ token: token });
        }
      }
    );
  } else {
    res.status(401).jsonp({ error: "credenciais erradas!" });
  }
});

module.exports = router;
