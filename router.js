const fs = require('fs');
const path = require('path');
const parser = require('url');
const logger = require('./logger');

const Handler = function(callback) {
  this.process = (req, res) => {
    return callback.apply(this, [req, res]);
  }
}

exports.route = (req) => {
  return matcher(req);
}

const defaultHandler = new Handler((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('Hello, mock server!');
  res.end();
});

const notFoundErrorHandler = new Handler((req, res) => {
  res.writeHead(404, {'Content-Type': 'text/plain'});
  res.write("No route registered for " + req.url);
  res.end();
});

const mimes = {
  ".xml" : "application/xml",
  ".json": "application/json"
};

const matcher = (req) => {
  const jsonfile = fs.readFileSync('./routes.json', 'utf-8');
  const json = JSON.parse(jsonfile);

  const url = parser.parse(req.url, true);
  const query = url.search || "";
  const requestPath = url.pathname + query;

  if (requestPath === '/' && req.method === 'GET') {
    return defaultHandler;
  }

  const route = json.routes.find((route) => {
    if (req.method.toUpperCase() !== route.method.toUpperCase()) {
      return false;
    }
    if (route.pathpattern) {
      const pattern = new RegExp(route.pathpattern);
      return pattern.test(requestPath);
    }
    return requestPath === route.path;
  });
  if (route) {
    try {
      const filepath = __dirname + "/public/" + route.response;
      const data = fs.readFileSync(filepath);
      const mime = mimes[path.extname(filepath)] || "text/plain";
      return new Handler((req, res) => {
        res.writeHead(route.status, {'Content-Type': mime});
        res.write(data);
        res.end();
      });
    } catch (e) {
      logger.error(e);
      return new Handler((req, res) => {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.write(JSON.stringify({ message : e.message }));
        res.end();
      });

    }
  }
  return notFoundErrorHandler;
}
