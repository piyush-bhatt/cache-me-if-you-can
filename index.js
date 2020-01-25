const express = require('express');

const bodyParser = require('body-parser');
const cacheRouter = require('./routers/cacheRouter');


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/cache', cacheRouter);

app.listen(8080, function () {
  console.log('Server running on port 8080');
});
