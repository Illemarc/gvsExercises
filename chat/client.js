const net = require("net");
const readline = require("readline");

// The first two elements are not arguments but paths to Node and the script file
const args = process.argv.slice(2); 

// create new connection
const client = net.createConnection({
  host: "127.0.0.2",
  port: 3333,
});

// log errors
client.on("error", (err) => {
  console.error(err);
});

// handle new connections from clients
client.on("connect", () => {
  console.log("client connected");

    // handle each line of data coming in
    let rlServer = readline.createInterface(client, client);
    rlServer.on("line", (data) => {
      try {
        let message = JSON.parse(data);
        console.log(message.sent + ' ' + message.from + ': ' + message.message);
      } catch (e) {
        console.log("invalid message encoding");
      }
    });

  // handle each line of data coming from command line
  const rlConsole = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  // Prompt the user to enter a message
  rlConsole.on('line',(message) => {
    // Send the message to the server
    let messageObj = {
      from: args, // Command line argument
      sent: Date.now(), // Current timestamp in milliseconds
      message: message
    };
    client.write(JSON.stringify(messageObj) + "\n");
  });
});
