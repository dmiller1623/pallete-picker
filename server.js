const express = require('express');
//this is bringing in the express library for us to use
const app = express();
//we a creating an instance of express
const environment = process.env.NODE_ENV || 'development';
//this is where we are delcaring what environment to use if there is a variable assigned
//to NODE.ENV then it will use that if not it will default to development
const configuration = require('./knexfile')[environment];
//we are using bracket notation here to speicfy what knex file we want to bring in
const database = require('knex')(configuration);
//connect to the data base using the envionments settings

const bodyParser = require('body-parser');
//bringing in the body parser node moudle

app.use(bodyParser.json());
//telling app to use the body parser library to parse our json
app.use(bodyParser.urlencoded({ extended: true }));


app.set('port', process.env.PORT || 3000);
//this is where we are assiging our port, either it will be assigned to 3000 or if there is a variable
//assigned to PORT then that will be the selected port

app.use(express.static('public'))
//this designates what file to look in to to serve up the files we want to use

app.get('/api/v1/projects', (request, response) => {
  //designate a endpoint for getting all the projects from the backend database
  database('projects').select()
  //selecting which database to get from
  .then((projects) => {
    //if successfull return the projects
    response.status(200).json(projects)
  })

  .catch((error) => {
    //if not sucecessfull return an error
    response.status(500).json({ error })
  })
})

app.get('/api/v1/palettes',(request, response) => {
  //setting up an endpoint to get all of the palettes from the backend database
  database('palettes').select()
  //selecting which database to get from
  .then((palettes) => {
    //if the resposne is successfull return the palettes 
    response.status(200).json(palettes)
  })
  .catch((error) => {
    //if not successfull return an error
    response.status(500).json({ error })
  })
})

app.post('/api/v1/projects', (request, response) => {
  //setting up an endpoint for posting a project to the backend database
  const project = request.body;
  //grabbing the body of the request object
    if(!project) {
      return response
      .status(422)
      .send({ error: `your missing a name property` });
      // if there is not a project name included in the request object return the respose
      //your missing a name property
    }

  database('projects').insert(project, 'id')
    //if there is a name included define what database to target and insert the project name
    .then(project => {
      //if successfull return the project id
      response.status(201).json({ id: project[0] })
    })

    .catch(error => {
      //if not successfull return an error
      response.status(500).json({ error })
    })
})

app.post('/api/v1/projects/:id/palettes', (request, response) => {
  //setting up an endpoint for postint a palette to a specific project
  let palette = request.body;
  //grabbing the data from the request body
  const id = request.params.id;
  //grabbing the project id designated from the request params
  palette = {...palette, project_id: id}
  //destructring the palette object and adding a project id

for (let requiredParamater of ['color_one', 'color_two', 'color_three', 'color_four', 'color_five', 'project_id', 'name']) {
  //checking to see if all of the requred params are in the palette object before its sent to the database
  if(!palette[requiredParamater]) {
    return response 
      .status(422)
      .send({ error: `your missing a ${requiredParamater} property` })
      //if there is a missing param then return an error saying your missing a specific param
  }
}

  database('palettes').insert(palette, 'id')
  //if every paramater is included select the palettes database to insert the palette
    .then(palette => {
      response.status(201).json({ id: palette[0] })
      //if successfull return the id for the palette
    })
    .catch(error => {
      response.status(500).json({ error })
      //if not successfull return an error
    }) 
})

app.delete('/api/v1/palettes/:id', (request, response) => {
  //set up an endpoin for deleting a specific palette 
  const id = request.params.id
  //grabbing the id from the request params to use 
  database('palettes').where('id', id).delete()
  //select the database from where to delete from and check the row with the matching id and delete
    .then(palette => {
      response.status(202).json({ id })
      //if successfull return the id
    })
    .catch(error => {
      response.status(500).json({ error })
      //if not successfull retur an error
    })
})

app.listen(app.get('port'), () => {
  //make sure that the server is listening for requests sent to the designated port
  console.log('server is running on local3000')
})

