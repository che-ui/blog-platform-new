const http = require('http');
const fs = require('fs');
const port = 3001;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello from Node.js server!\n');
});

server.listen(port, () => {
  const message = `Server running at http://localhost:${port}/\n`;
  console.log(message);
  fs.writeFileSync('server-log.txt', message);
  
  // Keep the server running by checking every 5 seconds
  setInterval(() => {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp}: Server still running\n`;
    console.log(logMessage);
    fs.appendFileSync('server-log.txt', logMessage);
  }, 5000);
});
