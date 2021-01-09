var mongoose = require('mongoose');

var studentSchema = new mongoose.Schema({
    Número: String,
    Nome: String,
    Git: String,
    tpc: [Number]
});


module.exports= mongoose.model('Aluno',studentSchema,'work');