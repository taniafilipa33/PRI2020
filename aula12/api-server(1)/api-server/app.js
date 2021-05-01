var createError = require("http-errors");
var express = require("express");
var logger = require("morgan");

var jwt = require("jsonwebtoken");

var indexRouter = require("./routes/index");

var mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/Tarefas2021", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Erro de conexão ao MongoDB..."));
db.once("open", function () {
  console.log("Conexão ao MongoDB realizada com sucesso...");
});

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

//pipeline para segurança
app.use(function (req, res, next) {
  var mytoken = req.query.token || req.body.token;
  jwt.verify(mytoken, "PRI2020", function (e, payload) {
    if (e)
      res.status(401).jsonp({ error: "nErro na verificação do token " + e });
    else {
      req.user = { level: payload.level, username: payload.username };
      next();
    }
  });
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500).jsonp({ error: err.message });
});

module.exports = app;
