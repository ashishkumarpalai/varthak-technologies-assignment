const fs = require("fs");

function logger(req, res, next) {
  const logStream = fs.createWriteStream("access.log", { flags: "a" });

  // Log the request method, URL, and timestamp
  const logEntry = `[${new Date().toLocaleString()}] ${req.method} ${req.url}\n`;
  logStream.write(logEntry);

  // Call the next middleware in the chain
  next();
}

module.exports = { logger };
