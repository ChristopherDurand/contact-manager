const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const contactRouter = require('./lib/contact_router');
const app = express();

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/contacts', contactRouter)

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});

module.exports = app; // for testing
