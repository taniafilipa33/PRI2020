var http = require('http')
var axios = require('axios')

http.createServer(function (req, res) {
    console.log(req.method + ' ' + req.url)
    if(req.method == 'GET'){
        if(req.url == '/'){
            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
            res.write('<h2>Escola de Música</h2>')
            res.write('<ul>')
            res.write('<li><a href="/alunos">Lista de alunos</a></li>')
            res.write('<li><a href="/cursos">Lista de Cursos</a></li>')
            res.write('<li><a href="/instrumentos">Lista de instrumentos</a></li>')
            res.write('</ul>')
            res.end()
        }
        else if(req.url == '/alunos'){
            axios.get('http://localhost:3000/alunos')
            .then(function (resp) {
                alunos = resp.data;
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write('<h2>Escola de Música: Lista de Alunos</h2>')
                res.write('<ul>')
            
                alunos.forEach(a => {
                    res.write('<li>' + a.id + ' - ' + '<a href="alunos/'+a.id+'">'+ a.nome +'</a>' + '</li>')
                });

                res.write('</ul>')
                res.write('<address>[<a href="/">Voltar</a>]</address>')
                res.end()
            })
            .catch(function (error)  {
                console.log('Erro na obtenção da lista de alunos: ' + error);
            }); 
        }else if(req.url.match(/^\/alunos\/[a-zA-Z][a-zA-Z0-9]*$/)){
            console.log(req.url.split("/")[2])
            axios.get('http://localhost:3000/alunos/' + req.url.split("/")[2])
            .then(function (resp) {
                alunos = resp.data;
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write('<h2>Aluno:</h2>')
                res.write('<p>ID:' + alunos.id +'</p>')
                res.write('<p>Nome:' + alunos.nome +'</p>')
                res.write('<p>Data de Nascimento:' + alunos.dataNasc +'</p>')
                res.write('<p>Curso:' + alunos.curso +'</p>')                
                res.write('<p>Ano:' + alunos.anoCurso +'</p>')
                res.write('<p>instrumento:' + alunos.instrumento +'</p>')
                res.write('<address>[<a href="/alunos">Voltar</a>]</address>')
                res.end()
            })
            .catch(function (error)  {
                console.log('Erro na obtenção da informação do aluno: ' + error);
            }); 
        }
        else if(req.url == '/cursos'){
            axios.get('http://localhost:3000/cursos')
            .then(function (resp) {
                alunos = resp.data;
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write('<h2>Escola de Música: Lista de Cursos</h2>')
                res.write('<ul>')
            
                alunos.forEach(a => {
                    res.write('<li>' + a.id + ' - ' + '<a href="cursos/'+a.id+'">'+a.designacao + '</a> </li>')
                });

                res.write('</ul>')
                res.write('<address>[<a href="/">Voltar</a>]</address>')
                res.end()
            })
            .catch(function (error)  {
                console.log('Erro na obtenção da lista de cursos: ' + error);
            }); 
        }
        else if(req.url.match(/^\/cursos\/[a-zA-Z]*[a-zA-Z0-9]*$/)){
            console.log(req.url.split("/")[2])
            axios.get('http://localhost:3000/cursos/' + req.url.split("/")[2])
            .then(function (resp) {
                cursos = resp.data;
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write('<h2>Curso:</h2>')
                res.write('<p>ID:' + cursos.id +'</p>')
                res.write('<p>Nome:' + cursos.designacao +'</p>')
                res.write('<p>Duracao:' + cursos.duracao +'</p>')
                res.write('<p>Instrumento:' + cursos.instrumento.id +'</p>')
                res.write('<address>[<a href="/cursos">Voltar</a>]</address>')
                res.end()
            })
            .catch(function (error)  {
                console.log('Erro na obtenção da informação do curso: ' + error);
            }); 
        }
        else if(req.url == '/instrumentos'){
            axios.get('http://localhost:3000/instrumentos')
            .then(function (resp) {
                alunos = resp.data;
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write('<h2>Escola de Música: Lista de Intrumentos</h2>')
                res.write('<ul>')
            
                alunos.forEach(a => {
                    res.write('<li>' + a.id + ' - ' + '<a href="intrumentos/'+a.id+'">'+`${a["#text"]}` + '</a></li>')
                });

                res.write('</ul>')
                res.write('<address>[<a href="/">Voltar</a>]</address>')
                res.end()
            })
            .catch(function (error)  {
                console.log('Erro na obtenção da lista de instrumentos: ' + error);
            }); 
        } else if(req.url.match(/^\/intrumentos\/[a-zA-Z][a-zA-Z0-9]*$/)){
            console.log(req.url.split("/")[2])
            axios.get('http://localhost:3000/instrumentos/' + req.url.split("/")[2])
            .then(function (resp) {
                cursos = resp.data;
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write('<h2>Intrumento:</h2>')
                res.write('<p>ID:' + cursos.id +'</p>')
                res.write('<p>Nome:' +  `${cursos["#text"]}` +'</p>')
                res.write('<address>[<a href="/instrumentos">Voltar</a>]</address>')
                res.end()
            })
            .catch(function (error)  {
                console.log('Erro na obtenção da informação do curso: ' + error);
            }); 
        }
        else{
            res.writeHead(200, {'Content-Type': 'text/html'})
            res.write("<p>Pedido não suportado: " + req.method + " " + req.url + "</p>")
            res.end() 
        }
    }
    else{
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.write("<p>Pedido não suportado: " + req.method + " " + req.url + "</p>")
        res.end()
    }
    
}).listen(4000)

console.log('Servidor à escuta na porta 4000...')
