const http = require('http');
const router = require('./router');

const server = http.createServer((req, res) => {
  const handler = router.route(req);
  handler.process(req, res);
  console.log("[%s] %s %s %s", (new Date()).toLocaleTimeString(), req.method, req.url, res.statusCode)
});

server.listen(8000);
console.log("[%s] %s", (new Date()).toLocaleTimeString(), 'Server running.. listening 8000');

