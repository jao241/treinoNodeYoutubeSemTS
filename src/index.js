//Definindo uma constante que recebe o express

const express = require('express');
const {uuid} = require('uuidv4');

//Definindo uma constante que utilizará os métodos e funções do 
//express
const app = express();

//Caso trabalhe com JSON no express deve-se explicitar sua utilização
app.use(express.json());

//filtrando uma pesquisa
//? é um parêmetro de consulta
//http://localhost:3333/projects?title=Node&owner=Aluizio

const projects = []; 

//Resposta a requisição com o método GET
app.get('/projects', (request, response) =>{
    //Restringe os parâmetros de consulta
    // const {title, owner} = request.query;
    // console.log(title);
    // console.log(owner);
    const {title} = request.query;
    const results = title 
        ? projects.filter(project =>
        project.title.includes(title))
        : projects;
    return response.json(results);
});

//Os dados são enviados no body da requisição
app.post('/projects', (request, response)=>{
    const {title, owner} = request.body;
    const id = uuid();
    const project = {
        id,
        title, 
        owner,
    };

    projects.push(project);
    return response.json(project);
});

//:+nome é um parâmetro de rota

app.put('/projects/:id', (request, response) =>{    
    const {id} = request.params;
    const {title, owner} = request.body;
    const projectIndex = projects.findIndex(project => project.id === id);

    if(projectIndex < 0){
        return response.status(400).json({ error: "Project not found!" });
    }

    const project = {id, 
        title,
        owner,
    };

    projects[projectIndex] = project;

    return response.json(project); 
});

app.delete('/projects/:id', (request, response)=>{
    const {id} = request.params;
    
    const projectIndex = projects.findIndex(project => project.id === id);

    if(projectIndex < 0){
        return response.status(400).json({ error: "Project not found!" });
    }

    projects.splice(projectIndex, 1);

    return response.status(204).json([]);
})

//Porta de entrada para a aplicação em Node.
app.listen(3333, ()=>{
    console.log('Backend started!')
});