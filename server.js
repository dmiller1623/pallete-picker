const express = require('express');
const app = express();
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

app.use(express.static('public'))

app.get('/', (request, response) => {
  response.send('Helooooooo')
});

app.get('/api/v1/palettes', (request, response) => {
  const palettes = app.locals.palettes;

  response.json({ palettes })
})

app.get('/api/v1/palettes/:id', (request, response) => {
  const palettes = app.locals.palettes;
  const id = request.params.id;
  const selectedPalette = palettes.find(pallete => {
    return pallete.id == id
  })
  return response.status(200).json(selectedPalette)
})

app.post('/api/v1/palettes', (request, response) => {
  const id = app.locals.palettes.length + 1
  const { newPalette } = request.body; 
  app.locals.palettes.push(newPalette)
  return response.status(201).json({ id, newPalette })
})

app.listen(app.get('port'), () => {
  console.log('server is running on local3000')
})

