const net = require("net");
const readline = require("readline");

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
        console.log(message.action + ' ' + message.key + ': ' + message.value);
      } catch (e) {
        console.log("invalid message encoding");
      }
    });

  function setValue(key, value) {
    let messageObj = {
      action: 'set',
      key: key,
      value: value
    };

    client.write(JSON.stringify(messageObj) + "\n");
  }


    // send a message every second
    let count = 0;
    setInterval(() => {
      let message = { count: count };
      client.write(JSON.stringify(message) + "\n");
      count++;
    }, 1000);
    
    //Calls the set function with different Values
    setValue(1, 'Eins');
    setValue(2, 'Zwei');
    setValue(3, 'Drei');
    setValue(4, 'Vier');
    setValue(5, 'Fünf');

});
