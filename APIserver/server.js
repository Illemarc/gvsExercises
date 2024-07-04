// Import the http module
const http = require('http');

// Two data objects in JSON Format
const data1 = {
    name: "Hans Dampf",
    age: 33,
    job: "Software Developer",
    "todos": [
        "Clean Car",
        "Buy Milk",
        "Do a workout"
      ],
};

const data2 = {
    name: "Willy Wonka",
    age: 40,
    job: "Chocolatier",
    "todos": [
        "Get Up",
        "Be awesome",
        "Go to bed"
      ],
};

// Combine the two data objects into an Array
const dataArray = [data1, data2];

// Create the HTTP Server
const server = http.createServer((req, res) => {
    // Set the response header to indicate JSON content
    res.setHeader('Content-Type', 'application/json');

    // Write the JSON data as a response
    res.writeHead(200); //sends a status code 200 to indicate the request was successful
    res.end(JSON.stringify(dataArray));
});

// Start the server and listen on port 3333
server.listen({host: '0.0.0.0', port: 3333}, () => {
    console.log('server listening on 0.0.0.0:3333');
  });