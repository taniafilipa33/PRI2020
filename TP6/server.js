var http = require("http");
var axios = require("axios");
var fs = require("fs");

var static = require("./static.js");

var { parse } = require("querystring");

// Funções auxilidares

function recuperaInfo(request, callback) {
  if (request.headers["content-type"] == "application/x-www-form-urlencoded") {
    let body = "";
    request.on("data", (bloco) => {
      body += bloco.toString();
    });
    request.on("end", () => {
      console.log(body);
      callback(parse(body));
    });
  }
}

function geraTarefasConcluido(tarefas, d) {
  let pagHTML = `
    <html>
        <head>
            <title>Tarefas Resolvidas ou Canceladas</title>
            <meta charset="utf-8"/>
            
        <link rel="icon" href="favicon.png"/>
            <link rel="stylesheet" href="/w3.css"/>
        </head>
        <body>
            <div class="w3-container w3-teal">
                <h2>
                Lista de Tarefas
                </h2>
                
            </div>
            <table class="w3-table w3-bordered">
                <tr>
                    <th>ID</th>
                    <th>Responsavel</th>
                    <th>Descrição</th>
                    <th>Data Limite</th>
                    <th>Estado</th>
                </tr>
  `;
  tarefas.forEach((a) => {
    if (a.resolvido == true) {
      pagHTML += `
   <tr>
       <td>${a.id}</td>
       <td>${a.responsavel}</td>       
       <td>${a.descricao}</td>
       <td>${a.dataLimite}</td>
       `
      if (a.cancelado == false) {
        pagHTML += `
           <td>
           Resolvido
       </td>
           `;
      } 
      if (a.cancelado == true) {
        pagHTML +=`  <td>Cancelado</td>
`
      }
    }
      `
    
   </tr>
   `;
    
  });

  pagHTML += `
        </table>
    </body>
    </html>
  `;
  return pagHTML;
}

function geraPagTarefas(tarefa, d) {
  let pagHTML = `
    <html>
        <head>
            <title>Lista de alunos</title>
            <meta charset="utf-8"/>
            
        <link rel="icon" href="favicon.png"/>
            <link rel="stylesheet" href="/w3.css"/>
        </head>
        <body>
            <div class="w3-container w3-teal">
                <h2>
                Lista de Tarefas
                </h2>
                
            </div>
            <table class="w3-table w3-bordered">
                <tr>
                    <th>ID</th>
                    <th>Responsavel</th>
                    <th>Descrição</th>
                    <th>Data Limite</th>
                    <th>Ação</th>
                </tr>
  `;

  tarefa.forEach((a) => {
    if (!(a.resolvido)) {
      pagHTML += `
   <tr>
       <td>${a.id}</td>
       <td>${a.responsavel}</td>       
       <td>${a.descricao}</td>
       <td>${a.dataLimite}</td>
       <td>
       <form action="/" method="POST">
       <input type=hidden name="id" value="${a.id}"/>
       <select name="estado">
           <option></option>
           <option>Resolvido</option>
           <option>Cancelado</option>
       </select>
       <input class="w3-btn w3-blue-grey" type="submit" value="Registar"/>
   </form>
       </td>
   </tr>
   `;
    }
  });

  pagHTML += `
        </table>
    </body>
    </html>
  `;
  return pagHTML;
}

// Template para o formulário de tarefa ------------------
function geraTarefa() {
  return `
      <html>
          <head>
              <title>Registo de Tarefa</title>
              <meta charset="utf-8"/>
              
          <link rel="icon" href="favicon.png"/>
              <link rel="stylesheet" href="/w3.css"/>
          </head>
          <body>
          
          </body>
              <div class="w3-container w3-teal">
                  <h2>Registo de Tarefa</h2>
              </div>
  
              <form class="w3-container" action="/" method="POST">
                  <label class="w3-text-teal"><b>Descricao</b></label>
                  <input class="w3-input w3-border w3-light-grey" type="text" name="descricao">
            
                  <label class="w3-text-teal"><b>Responsável</b></label>
                  <input class="w3-input w3-border w3-light-grey" type="text" name="responsavel">
  
                  <label class="w3-text-teal"><b>Data Limite</b></label>
                  <input class="w3-input w3-border w3-light-grey" type="date" name="dataLimite">
  
                  <input type="hidden" name="resolvido" value="false"/>
                  <input type="hidden" name="cancelado" value="false"/>
            
                  <input class="w3-btn w3-blue-grey" type="submit" value="Agendar"/>
                  <input class="w3-btn w3-blue-grey" type="reset" value="Limpar valores"/> 
              </form>
          </body>
      </html>
      `;
}

// Criação do servidor

const { response } = require("express");

var galunoServer = http.createServer(function (req, res) {
  // Logger: que pedido chegou e quando
  var d = new Date().toISOString().substr(0, 16);

  // Tratamento do pedido
  if (static.recursoEstatico(req)) {
    static.sirvoRecursoEstatico(req, res);
  } else {
    switch (req.method) {
      case "GET":
        // GET /tarefas --------------------------------------------------------------------
        if (req.url == "/") {
          axios
            .get("http://localhost:3000/tarefas?_sort=dataLimite,responsavel")
            .then((response) => {
              var tarefa = response.data;
              res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
              res.write(geraTarefa());
              res.write(geraPagTarefas(tarefa, d));

              res.write(geraTarefasConcluido(tarefa, d));
              res.end();
            })
            .catch(function (erro) {
              res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
              res.write("<p>Não foi possível obter a tarefas...");
              res.end();
            });
        } else {
          res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
          res.write(
            "<p>" + req.method + " " + req.url + " serviço não suportado.</p>"
          );
          res.end();
        }
        break;
      case "POST":
        if (req.url == "/") {
          recuperaInfo(req, function (info) {
            if (info.descricao != null) {
              info.resolvido = false;
              info.cancelado = false;
              axios
                .post("http://localhost:3000/tarefas", info)
                .then((resp) => {
                  axios
                    .get("http://localhost:3000/tarefas?_sort=dataLimite,responsavel")
                    .then((response) => {
                      var tarefa = response.data;
                      res.writeHead(200, {
                        "Content-Type": "text/html;charset=utf-8",
                      });
                      res.write(geraTarefa(d));
                      res.write(geraPagTarefas(tarefa, d));
                      res.write(geraTarefasConcluido(tarefa, d));
                      res.end();
                    })
                    .catch(function (erro) {
                      res.writeHead(200, {
                        "Content-Type": "text/html;charset=utf-8",
                      });
                      res.write("<p>Não foi possível obter a tarefas...");
                      res.end();
                    });
                })
                .catch(function (erro) {
                  res.writeHead(200, {
                    "Content-Type": "text/html;charset=utf-8",
                  });
                  res.write("<p>Não foi possível obter a tarefas...");
                  res.end();
                });
            } else {
              axios
                .get("http://localhost:3000/tarefas")
                .then((response) => {
                  var tarefas = response.data;
                  var rState = false;
                  var cState = false;
                  if (info.estado == "Resolvido") rState = true;
                  else if (info.estado == "Cancelado") {cState = true; rState = true; }
                  else {
                  }

                  tarefas.forEach((t) => {
                    if (t.id == info.id) {
                      axios
                        .put("http://localhost:3000/tarefas/" + info.id, {
                          descricao: t.descricao,
                          responsavel: t.responsavel,
                          dataLimite: t.dataLimite,
                          resolvido: rState,
                          cancelado: cState,
                          id: t.id,
                        })
                        .then((resp) => {
                          console.log(resp.data);
                        })
                        .catch((error) => {
                          console.log("ERRO: " + error);
                        });
                    }
                  });
                  axios
                    .get("http://localhost:3000/tarefas?_sort=dataLimite,responsavel")
                    .then((response) => {
                      var tarefa = response.data;
                      res.writeHead(200, {
                        "Content-Type": "text/html;charset=utf-8",
                      });
                      res.write(geraTarefa(d));
                      res.write(geraPagTarefas(tarefa, d));

                      res.write(geraTarefasConcluido(tarefa, d));

                      res.end();
                    })
                    .catch(function (erro) {
                      res.writeHead(200, {
                        "Content-Type": "text/html;charset=utf-8",
                      });
                      res.write("<p>Não foi possível obter a tarefas...");
                      res.end();
                    });
                })
                .catch(function (erro) {
                  res.writeHead(200, {
                    "Content-Type": "text/html;charset=utf-8",
                  });
                  res.write("<p>Não foi possível obter a lista de tarefas...");
                  res.end();
                });
            }
          });
        } else {
          res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
          res.write("<p>Erro no post: " + erro + "</p>");
          res.write('<p><a href="/">Voltar</a></p>');
          res.end();
        }
        break;
      default:
        res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
        res.write("<p>" + req.method + " não suportado neste serviço.</p>");
        res.end();
    }
  }
});

galunoServer.listen(7777);
console.log("Servidor à escuta na porta 7777...");
