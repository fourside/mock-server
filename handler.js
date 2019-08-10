exports.createHandler = (method) => {
  return new Handler(method);
}

const Handler = function(method) {
  this.process = function(req, res) {
    return method.apply(this, [req, res]);
  }
}
