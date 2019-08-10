const fs = require('fs');
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

exports.GET = (url, callback) => {
  register('GET', url, callback);
}
exports.POST = (url, callback) => {
  register('POST', url, callback);
}
exports.PUT = (url, callback) => {
  register('PUT', url, callback);
}
exports.DELETE = (url, callback) => {
  register('DELETE', url, callback);
}

exports.route = (req) => {
  const url = parser.parse(req.url, true);
  const query = url.search || "";
  const pathHandler = handlers[url.pathname + query];
  if (!pathHandler) {
    return errorHandler;
  }
  const handler = pathHandler[req.method];
  if (!handler) {
    return errorHandler;
  }
  return handler;
}

const errorHandler = new Handler((req, res) => {
  res.writeHead(404, {'Content-Type': 'text/plain'});
  res.write("No route registered for " + req.url);
  res.end();
});

(function loadRoutes() {
  const jsonfile = fs.readFileSync('./routes.json', 'utf-8');
  const json = JSON.parse(jsonfile);
  json.routes.forEach((route) => {
    register(route.method, route.path, (req, res) => {
      const data = fs.readFileSync(__dirname + "/public/" + route.response);
      res.writeHead(route.status, {'Content-Type': 'application/json'});
      res.write(data);
      res.end();
    });
  });
})();
