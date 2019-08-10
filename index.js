const http = require('http');
const router = require('./router');
const logger = require('./logger');

const server = http.createServer((req, res) => {
  const handler = router.route(req);
  handler.process(req, res);
  logger.info(req.method, req.url, res.statusCode);
});

server.listen(8000);
logger.info("Server running.. listening 8000");

