const express = require('express');
const app = express();

app.set('port', 3000);

app.use(express.static('public'))

app.get('/', (request, response) => {
  response.send('Helooooooo')
});

app.listen(app.get('port'), () => {
  console.log('server is running on local3000')
})