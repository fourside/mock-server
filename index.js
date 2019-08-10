const http = require('http');
const router = require('./router');
const logger = require('./logger');

const server = http.createServer((req, res) => {
  const handler = router.route(req);
  handler.process(req, res);
  logger.info(req.method, req.url, res.statusCode);
});

const port = process.env.port || 8000;
server.listen(port);
logger.info("Server running.. listening", port);

