const handlerFactory = require('./handler');
const fs = require('fs');
const parser = require('url');
const handlers = {};

exports.register = (url, method) => {
  handlers[url] = handlerFactory.createHandler(method);
}

exports.route = (req) => {
  const url = parser.parse(req.url, true);
  const handler = handlers[url.pathname] || this.missing(req);
  return handler;
}

exports.missing = (req) => {
  // Try to read the file locally, this is a security hole, yo /../../etc/passwd
  const url = parser.parse(req.url, true);
  const path = __dirname + "/public" + url.pathname
  try {    
    const data = fs.readFileSync(path);
    const mime = req.headers.accepts || 'text/html'
    return handlerFactory.createHandler((req, res) => {
      res.writeHead(200, {'Content-Type': mime});
      res.write(data);
      res.end();
    });        
  } catch (e) { 
    console.log(e);
    return handlerFactory.createHandler((req, res) => {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.write("No route registered for " + url.pathname);
      res.end();
    });      
  }  
}

