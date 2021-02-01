const app = require('./app');
const http = require('http');
const server = http.createServer(app);

server.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});

module.exports = app; // for testing
