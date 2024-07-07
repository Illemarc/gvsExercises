class Chat {
  boot() {
    this.configure();
    this.fetchElements();
    this.setup();
    this.connect();
  }

  // fetch configuration from URL search params
  // name=Marcel
  // host=127.0.0.1
  configure() {
    const search = document.location.search;
    const params = new URLSearchParams(search);

    // setup user name
    if (params.has("name")) {
      this.name = params.get("name");
    } else {
      params.set("name", "Marcel I");
      document.location.search = "?" + params.toString();
    }

    // setup host
    if (params.has("host")) {
      this.host = params.get("host");
      this.server = `ws://${this.host}:8001`;
    } else {
      params.set("host", "127.0.0.1");
      document.location.search = "?" + params.toString();
    }
  }

  // fetch DOM elements to manipulate
  fetchElements() {
    this.status = document.querySelector(".chat-status");
    this.messages = document.querySelector(".chat-messages");
    this.inputName = document.querySelector(".chat-input-name");
    this.inputText = document.querySelector(".chat-input-text");
    this.inputSendButton = document.querySelector(".chat-input-send-button");
  }

  // setup interface
  setup() {
    // user name
    this.inputName.textContent = this.name;

    // text input
    this.inputText.addEventListener("keyup", (e) => {
      if (e.key !== "Enter") {
        return;
      }
      this.sendMessage(this.inputText.textContent);
      this.inputText.textContent = "";
    });

    // button
    this.inputSendButton.addEventListener("mousedown", (e) => {
      e.stopImmediatePropagation();
      this.sendMessage(this.inputText.textContent);
      this.inputText.textContent = "";
      setTimeout(() => {
        this.inputText.focus();
      }, 0);
    });

    this.inputText.focus();
  }

  // connect websocket and setup handlers
  connect() {
    this.socket = new WebSocket(this.server);

    // handle error
    this.socket.addEventListener("error", (event) => {
      this.status.textContent = `Error connecting to ${this.server}`;
      this.status.classList.add("chat-status-error");
    });

    // handle connected
    this.socket.addEventListener("open", (event) => {
      this.status.textContent = `Connected to ${this.server}`;
      this.status.classList.add("chat-status-ok");
      this.sendMessage("has connected");
    });

    // handle incoming messages
    this.socket.addEventListener("message", (event) => {
      this.receiveMessage(event.data);
    });
  }

  // send the text via websocket
  sendMessage(text) {
    let message = {
      from: this.name,
      time: Date.now(),
      text: text,
    };
    let encoded = JSON.stringify(message);
    this.socket.send(encoded);
  }

  // append incoming message to messages list
  receiveMessage(data) {
    let message = JSON.parse(data);

    // create message container and add it
    let container = document.createElement("div");
    container.classList.add("chat-message");
    this.messages.appendChild(container);

    let info = document.createElement("div");
    info.classList.add("chat-message-info");
    container.appendChild(info);

    let from = document.createElement("div");
    from.classList.add("chat-message-from");
    from.textContent = message.from;
    info.appendChild(from);

    let date = new Date(message.time);
    let time = document.createElement("div");
    time.classList.add("chat-message-time");
    time.textContent = date.toLocaleTimeString("de-DE");
    info.appendChild(time);

    let text = document.createElement("div");
    text.classList.add("chat-message-text");
    text.textContent = message.text;
    container.appendChild(text);

    // make message visible
    container.scrollIntoView();
  }
}
