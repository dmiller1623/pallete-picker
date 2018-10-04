const express = require('express');
const app = express();
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', 3000);

app.locals.palettes = [
  {id: 1, colors: ['#152957', '#831FAE', '#98D906', '#7ADC8F', '#BD7C3A']},
  {id: 2, colors: ['#CD5789', '#AAEE67', '#56CD87', '#BBA432', '#EA6548']},
  {id: 3, colors: ['#AE5643', '#CD4321', '#89AA22', '#7C763F', '#AF9385']},
  {id: 4, colors: ['#BC9097', '#EF6789', '#78EEC4', '#9A4567', '#CDB889']}
]

app.locals.folders

app.use(express.static('public'))

// app.get('/', (request, response) => {
//   response.send('Helooooooo')
// });

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
  .then((projects) => {
    response.status(200).json(projects)
  })

  .catch((error) => {
    response.status(500).json({ error })
  })
})

app.get('/api/v1/palettes',(request, response) => {
  database('palettes').select()
  .then((palettes) => {
    response.status(200).json(palettes)
  })
  .catch((error) => {
    response.status(500).json({ error })
  })
})

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;
 
    if(!project.name) {
      return response
        .status(422)
        .send({ error: `your missing ${requiredParamater} property`});
    }

  database('projects').insert(project, 'id')
    .then(project => {
      response.status(201).json({ id: project[0] })
    })

    .catch(error => {
      response.status(500).json({ error })
    })
})

app.post('/api/v1/projects/:id/palettes', (request, response) => {
  const palette = request.body;
  const id = request.params.id;
  const newPalette = {...palette, id}
  console.log(newPalette)

for (let requiredParamater of ['color_one', 'color_two', 'color_three', 'color_four', 'color_five', 'project_id', 'name']) {
  if(!palette[requiredParamater]) {
    return response 
      .status(422)
      .send({ error: `your missing a ${requiredParamater} property` })
  }
}

  database('palettes').insert(newPalette, 'id')
    .then(palette => {
      response.status(201).json({ id: palette[0] })
    })
    .catch(error => {
      response.status(500).json({ error })
    }) 
})

// app.get('/api/v1/palettes', (request, response) => {
//   const palettes = app.locals.palettes;

//   response.json({ palettes })
// })

// app.get('/api/v1/palettes/:id', (request, response) => {
//   const palettes = app.locals.palettes;
//   const id = request.params.id;
//   const selectedPalette = palettes.find(pallete => {
//     return pallete.id == id
//   })
//   return response.status(200).json(selectedPalette)
// })

app.post('/api/v1/palettes', (request, response) => {
  const id = app.locals.palettes.length + 1
  const { newPalette } = request.body; 
  app.locals.palettes.push({...newPalette, id})
  return response.status(201).json({ newPalette, id })
})

app.listen(app.get('port'), () => {
  console.log('server is running on local3000')
})

