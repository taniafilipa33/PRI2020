const aluno = require('../models/aluno')
var Aluno = require('../models/aluno')

//Devolve lista de alunos
module.exports.listar = () =>{
        return Aluno
        .find()
        .exec()
}

module.exports.consultar = id => {
    return Aluno
    .findOne({_id: id})
    .exec()
}


module.exports.inserir = a => {
    var novo = new Aluno(a)
    return novo.save()
}

module.exports.editar = (a,id) => {
    console.log(id);
    return Aluno
        .updateOne({_id:id},a)
        .exec()
}

module.exports.eliminar = (id,a) => {
    return Aluno
            .deleteOne({ _id: id },a)
}