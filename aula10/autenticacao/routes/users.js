var express = require('express');
const passport = require('passport');
var router = express.Router();
var User = require('../controller/user')
/* GET users listing. */

router.get('/login', function(req, res) {
  res.render('login-form');
});

router.get('/register', function(req, res) {
  res.render('reg-form');
});

router.post('/login',passport.authenticate('local'), function(req, res) {
  console.log('CB login')
  console.log('AUTH: ' +JSON.stringify(req.user))
  console.log(res.body);
  res.redirect('/protegida');
});

router.post('/register', function(req, res) {
  User.insert(req.body)
  res.redirect('/');
});


module.exports = router;
