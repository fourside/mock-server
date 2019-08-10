exports.info = (...arg) => {
  log(console.info, "INFO", arg);
};
exports.warn = (...arg) => {
  log(console.warn, "WARN", arg);
};
exports.error = (...arg) => {
  log(console.error, "ERR ", arg);
};

const log = (method, logLevel, arg) => {
  const placeholder = "[%s] [%s]" + " %s".repeat(arg.length);
  const time = (new Date()).toLocaleTimeString();
  method.apply(this, [placeholder, time, logLevel, ...arg]);
};

