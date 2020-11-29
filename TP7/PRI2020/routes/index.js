var express = require('express');
var router = express.Router();
const Aluno = require('../controllers/aluno')
//Import the mongoose module
var mongoose = require('mongoose');
//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/PRI2020';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error...'));
db.once('open', function() {
    console.log("Conexão ao MongoDB realizada com sucesso...")
});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Turma PRI de 2020' });
});

router.get('/alunos', (req,res)=>{
  Aluno.listar()
    .then(dados => res.render('alunos', {lista:dados}))
    .catch(e => res.render('error', {error:e}))
})



//get alunos registar
router.get(/\/alunos\/registar/, (req, res) => {

  res.render('registo',{title: 'Registar novo Aluno'})
})

//post alunos
router.post('/registar', (req,res)=>{

  var valores = [0,0,0,0,0,0,0,0]
  if (req.body.tpc1 == 'on')
    valores[0] = 1
  if (req.body.tpc2 == 'on')
    valores[1] = 1
  if (req.body.tpc3 == 'on')
    valores[2] = 1
  if (req.body.tpc4 == 'on')
    valores[3] = 1
  if (req.body.tpc5 == 'on')
    valores[4] = 1
  if (req.body.tpc6 == 'on')
    valores[5] = 1
  if (req.body.tpc7 == 'on')
    valores[6] = 1
  if (req.body.tpc8 == 'on')
    valores[7] = 1
  req.body.tpc = valores
  Aluno.inserir(req.body)
  res.redirect('/alunos')
})

//get alunos delete
router.get(/\/alunos\/delete\/[0-9a-zA-Z]*/, (req, res) => {
  var split = req.url.split('/')[3]
  console.log(split)
  Aluno.consultar(split)
    .then(aluno=>res.render('delete', {aluno:aluno}))
    .catch(e => res.render('error', {error:e}))
})


//delete /alunos/delete/id
router.delete(/\/delete\/[0-9a-zA-Z]*/, (req,res)=>{
  var split = req.url.split('/')[2]
  console.log(split)
  Aluno.eliminar(split,req.body)
  res.redirect('/alunos')
})


//post
router.post(/\/editar\/[0-9a-zA-Z]*/,(req,res) => {
  var valores = [0,0,0,0,0,0,0,0]
  console.log(req.url)
  var id = req.url.split('/')[2]
  if (req.body.tpc1 == 'on')
    valores[0] = 1
  if (req.body.tpc2 == 'on')
    valores[1] = 1
  if (req.body.tpc3 == 'on')
    valores[2] = 1
  if (req.body.tpc4 == 'on')
    valores[3] = 1
  if (req.body.tpc5 == 'on')
    valores[4] = 1
  if (req.body.tpc6 == 'on')
    valores[5] = 1
  if (req.body.tpc7 == 'on')
    valores[6] = 1
  if (req.body.tpc8 == 'on')
    valores[7] = 1
  req.body.tpc = valores
  Aluno.editar(req.body,id)
  console.log("oi")
  res.redirect('/alunos')
})

//get alunos editar
router.get(/\/alunos\/editar\/[0-9a-zA-Z]*/, (req, res) => {
  var id = req.url.split('/')[3]

  Aluno.consultar(id)
    .then(aluno=>res.render('editar', {aluno:aluno}))
    .catch(e => res.render('error', {error:e}))
  })



//get /alunos/id
router.get(/\/alunos\/[0-9a-zA-Z]*/, (req,res)=>{
  var split = req.url.split("/")[2]
  //console.log(split)
  Aluno.consultar(split)
    .then(dados => res.render('aluno', {lista:dados}))
    .catch(e => res.render('error', {error:e}))

})



module.exports = router;
