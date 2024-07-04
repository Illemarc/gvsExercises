const {rejects} = require('assert');
const net = require('net');

/**
 * Request class for HTTP requests holding a TCP
 * socket and an HTTP method, headers and an optional body
*/
class Request {
  /**
   *
   * @param {*} socket TCP connection to host
   * @param {*} method HTTP method used in request
   * @param {*} headers headers for the request
   * @param {*} body Optional body of HTTP request
   */
  constructor(socket, method, headers, body = '') {
    this.socket = socket;
    this.method = method;
    this.headers = headers;
    this.body = body;
  };


  /**
   * Send the request to server
   */
  send() {
    //check if body exists
    if (this.body.length != 0) {
      this.socket.write(`${this.method}\n${this.headers}\n${this.body}\n\n`);
    } else {
      this.socket.write(`${this.method}\n${this.headers}\n\n`);
    }
  };
};


/**
 * listens for HTTP responses on a socket,
   parses the status, headers and body
 */
class Response {
  /**
   *
   * @param {*} socket TCP connection to server
   */
  constructor(socket) {
    this.socket = socket;
    let data = '';

    this.socket.on('data', (chunk) => {
      data += chunk.toString();
    });

    this.socket.on('end', () => {
      this.parseResponse(data);
    });
  };
  /**
   * splits a response into status, headers and body
   * @param {*} data response as string
   */
  parseResponse(data) {
    const splitContent = data.split('\r\n\r\n');
    const lines = [...splitContent[0].split('\r\n')];
    this.status = lines[0];
    this.headers = [...lines.slice(1)];
    this.body = splitContent[1];
  }
};

const request = async function(url, headers, body) {
  const client = net.createConnection({
    host: '127.0.0.1',
    port: 8000,
  });

  const response = new Promise((resolve, reject) => {
    client.on('error', (err) => {
      reject(err); // Reject the Promise on socket error
    });

    const newResponse = new Response(client);
    newResponse.socket.on('end', () => {
      try {
        resolve(newResponse);
      } catch (error) {
        reject(error);
      } finally {
        client.end();
      }
    });
  });
  new Request(client, url, headers, body).send();
  return response;
};

request('GET / HTTP/1.1',
    'Host: 127.0.0.1',
    'My body',
).then((response) => {
  console.log(response);
});