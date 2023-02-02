// src/app.js

const express = require('express');


require('express-async-errors'); // não precisa definir uma variável
const apiCredentials = require('./middlewares/apiCredentials');
app.use(express.json());
app.use(apiCredentials); 
const app = express();
const validateTeam = require('./middlewares/validateTeam');
const existingId = require('./middlewares/existingId');

let nextId = 3;
const teams = [
  { id: 1, nome: 'São Paulo Futebol Clube', sigla: 'SPF' },
  { id: 2, nome: 'Sociedade Esportiva Palmeiras', sigla: 'PAL' },
];

app.use(express.json());

app.get('/teams', (req, res) => res.json(teams));

app.post('/teams', validateTeam, (req, res) => {
  const team = { id: nextId, ...req.body };
  teams.push(team);
  nextId += 1;
  res.status(201).json(team);
});

app.post('/teams', validateTeam, (req, res) => {
  const requiredProperties = ['nome', 'sigla'];
  if (requiredProperties.every((property) => property in req.body)) {
    const team = { id: nextId, ...req.body };
    teams.push(team);
    nextId += 1;
    res.status(201).json(team);
  } else {
    res.sendStatus(400);
  }
});

app.put('/teams/:id', existingId, validateTeam, (req, res) => {
  const id = Number(req.params.id);
  const team = teams.find(t => t.id === id);
   // não precisamos mais conferir, com certeza o team existe
    const index = teams.indexOf(team);
    const updated = { id, ...req.body };
    teams.splice(index, 1, updated);
    res.status(201).json(updated);
});

app.delete('/teams/:id', existingId, (req, res) => {
  const id = Number(req.params.id);
  const team = teams.find(t => t.id === id);
    const index = teams.indexOf(team);
    teams.splice(index, 1);
  res.sendStatus(204);
});

module.exports = app;


// Repare como o método POST foi definido de uma maneira mais direta e reaproveitável, deixando os detalhes
//  de validação para o middleware validateTeam. Se a requisição chegou no segundo middleware, ele pode criar
//   o time sem se preocupar com mais nada.

// Os middlewares seguintes podem receber o next como um terceiro parâmetro, mas geralmente o último 
// middleware de uma rota precisa responder a requisição. Portanto, se ele não for chamar outro middleware,
//  não há necessidade de usar o objeto next e você pode escrever a função recebendo apenas dois parâmetros: os objetos req e res


// E o que o middleware validateTeam faz?
// 1️⃣ Faz uma validação básica que apenas confere se todas as propriedades esperadas estão presentes no req.body.

// 2️⃣ Se a validação aprovar, esse middleware endereça a requisição para o próximo middleware, que efetivamente cria o time.

// 3️⃣ Se a validação falhar, esse middleware retorna uma resposta com status 400 e nunca chama o próximo middleware. 400 é o 
// código HTTP para Bad Request, indicando que existe algo errado na requisição.