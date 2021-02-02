const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const contactRouter = require('./lib/contact_router');
const app = express();

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/contacts', contactRouter)

module.exports = app; // for testing
