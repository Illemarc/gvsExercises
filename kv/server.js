const net = require('net');
const readline = require('readline');

const server = net.createServer();

// map for storing key value pairs
const kvMap = new Map();

// log errors
server.on('error', (err) => {
  console.error(err);
});


// code executed on new client connection
server.on('connection', (client) => {
  console.log('client connected', client.address());

  rl = readline.createInterface(client, client);

  rl.on('line', (data) => {
    const request = JSON.parse(data);

    if (request.action == 'get') {
      let value = 'null';
      if (kvMap[request.key] != undefined) {
        value = kvMap[request.key];
      }

      client.write(value + '\n');
    } else {
      kvMap[request.key] = request.value;
    }
  });
});

// listen on port 3333
server.listen({host: '0.0.0.0', port: 3333}, () => {
  console.log('server listening on 0.0.0.0:3333');
});