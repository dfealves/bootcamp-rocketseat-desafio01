const express = require('express');

const server = express();

server.use(express.json());
let count = 0;
const projects = [];

//checando se o projeto já existe
function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id)

  if(!project){
    return res.status(400).json({ error: 'Project not found' })
  }
  return next()
}

function logRequest(req, res, next) {
  count++;
  console.log(`Número de requisições ${count}`)
  return next();
}

//criar novo projeto
server.post('/projects', logRequest,(req, res) =>{
  const { id, title } = req.body;
  
  const project = {
    id,
    title,
    tasks: []
  }

  projects.push(project)

  return res.json(project)
});

//listar todos projetos
server.get('/projects', (req, res) => {
  return res.json(projects);
});

//update
server.put('/projects/:id', checkProjectExists, (req, res) => {
  // Rrecebe o id da posição que sera alterado
  const { id } = req.params;
  // Recebe o novo valor do campo modificado
  const { title } = req.body;
  
  const project = {
    id,
    title,
    tasks:[]
  }

  projects[id] = project;
  
  return res.json(projects)  
})


server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const index = projects.findIndex(project => project.id === id);

  projects.splice(index, 1);

  return res.send();
});

server.post('/projects/:id/tasks', (req, res) =>{
  const { id } = req.params;
  const { title } = req.body;

  const project = {
    id,
    title,
    task: []
  }

  projects[id].tasks.push(title);
  
  return res.json(projects);

})


server.listen(3000);