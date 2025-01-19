const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const http = require('http');

const requestListener = (request, response) => {
  response.setHeader('Content-Type', 'application/json');
  response.writeHead(200);
  const data = {
    message: 'Hello from Node.js',
  };
  response.end(JSON.stringify(data));
};

const server = http.createServer(requestListener);

//Cluster setup for scalability
if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP port.
  server.listen(8080);
  console.log(`Worker ${process.pid} started`);
  server.on('error', (err) => {
    console.error('Server error:', err);
  });
}
