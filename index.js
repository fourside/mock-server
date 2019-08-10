
const http = require('http');
const router = require('./router');

router.GET('/', (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('Hello World');
  res.end();
});

const server = http.createServer((req, res) => {
  const handler = router.route(req);
  handler.process(req, res);
});

// Start it up
server.listen(8000);
console.log('Server running');
