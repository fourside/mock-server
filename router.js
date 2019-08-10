const fs = require('fs');
const path = require('path');
const parser = require('url');
const handlers = {};

const Handler = function(callback) {
  this.process = (req, res) => {
    return callback.apply(this, [req, res]);
  }
}

const register = (method, url, callback) => {
  if (!handlers[url]) {
    handlers[url] = {};
  };
  handlers[url][method.toUpperCase()] = new Handler(callback);
}

// default routing
register('GET', '/', (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('Hello, mock server!');
  res.end();
});

exports.route = (req) => {
  const url = parser.parse(req.url, true);
  const query = url.search || "";
  const pathHandler = handlers[url.pathname];
  if (pathHandler) {
    return pathHandler;
  }
  return matchHandler(req);
}

const errorHandler = new Handler((req, res) => {
  res.writeHead(404, {'Content-Type': 'text/plain'});
  res.write("No route registered for " + req.url);
  res.end();
});

const mimes = {
  ".xml" : "application/xml",
  ".json": "application/json"
};

const matchHandler = (req) => {
  const jsonfile = fs.readFileSync('./routes.json', 'utf-8');
  const json = JSON.parse(jsonfile);

  const url = parser.parse(req.url, true);
  const query = url.search || "";
  const requestPath = url.pathname + query;
  const route = json.routes.find((route) => {
    return req.method.toUpperCase() === route.method.toUpperCase() && requestPath === route.path;
  });
  if (route) {
    return new Handler((req, res) => {
      const filepath = __dirname + "/public/" + route.response;
      const data = fs.readFileSync(filepath);
      const mime = mimes[path.extname(filepath)] || "text/plain";
      res.writeHead(route.status, {'Content-Type': mime});
      res.write(data);
      res.end();
    });
  }
  return errorHandler;
}
