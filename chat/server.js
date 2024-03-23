const net = require("net");
const readline = require("readline");

// create new server
const server = net.createServer();

// log errors
server.on("error", (err) => {
  console.error(err);
});

//list of all connected clients
const clients = [];

// handle new connections from clients
server.on("connection", (client) => {
  console.log("client connected", client.address());
  clients.push(client);
  // handle each line of data coming in
    let rl = readline.createInterface(client);
    rl.on("line", (data) => {
      try {
        let message = JSON.parse(data);
        for (let i = 0; i < clients.length; i++) {
          if (clients[i] != client){
            clients[i].write(JSON.stringify(message) + "\n");
          }
        }
      } catch (e) {
        console.log("invalid message encoding");
      }
    });
});

// listen on port 3333
server.listen({ host: "0.0.0.0", port: 3333 }, () => {
  console.log("server listening on 0.0.0.0:3333");
});
