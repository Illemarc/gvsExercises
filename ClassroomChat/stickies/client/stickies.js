class StickyNotesApp {
  constructor() {
    this.stickies = {};
  }

  boot() {
    this.configure();
    this.fetchElements();
    this.setup();
    this.connect();
  }

  configure() {
    const search = document.location.search;
    const params = new URLSearchParams(search);

    if (params.has("name")) {
      this.name = params.get("name");
    } else {
      params.set("name", "Hans");
      document.location.search = "?" + params.toString();
    }

    if (params.has("host")) {
      this.host = params.get("host");
      this.server = `ws://${this.host}:8000`;
    } else {
      params.set("host", "127.0.0.1");
      document.location.search = "?" + params.toString();
    }
  }

  fetchElements() {
    this.status = document.querySelector(".sticky-status");
    this.notes = document.querySelector(".sticky-notes");
    this.inputName = document.querySelector(".sticky-input-name");
    this.inputText = document.querySelector(".sticky-input-text");
    this.inputSendButton = document.querySelector(".sticky-input-send-button");
  }

  setup() {
    this.inputName.textContent = this.name;

    this.inputText.addEventListener("keyup", (e) => {
      if (e.key !== "Enter") {
        return;
      }
      this.createSticky(this.inputText.textContent);
      this.inputText.textContent = "";
    });

    this.inputSendButton.addEventListener("mousedown", (e) => {
      e.stopImmediatePropagation();
      this.createSticky(this.inputText.textContent);
      this.inputText.textContent = "";
      setTimeout(() => {
        this.inputText.focus();
      }, 0);
    });

    this.inputText.focus();
  }

  connect() {
    this.socket = new WebSocket(this.server);

    this.socket.addEventListener("error", (event) => {
      this.status.textContent = `Error connecting to ${this.server}`;
      this.status.classList.add("sticky-status-error");
    });

    this.socket.addEventListener("open", (event) => {
      this.status.textContent = `Connected to ${this.server}`;
      this.status.classList.add("sticky-status-ok");
      this.sendSticky({
        id: this.generateUUID(),
        x: 50,
        y: 50,
        text: "has connected",
        from: this.name
      });
    });

    this.socket.addEventListener("message", (event) => {
      this.receiveSticky(event.data);
    });
  }

  sendSticky(sticky) {
    let encoded = JSON.stringify(sticky);
    this.socket.send(encoded);
  }

  receiveSticky(data) {
    let sticky = JSON.parse(data);
    this.addStickyToDOM(sticky);
  }

  createSticky(text) {
    let sticky = {
      id: this.generateUUID(),
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      text: text,
      from: this.name
    };
    this.stickies[sticky.id] = sticky; // Save the sticky note in the stickies object
    this.sendSticky(sticky);
    this.addStickyToDOM(sticky);
  }

  addStickyToDOM(sticky) {
    if (!this.stickies[sticky.id]) {
      this.stickies[sticky.id] = sticky;
    }

    let container = document.createElement("div");
    container.classList.add("sticky-note");
    container.style.left = `${sticky.x}px`;
    container.style.top = `${sticky.y}px`;
    container.setAttribute("data-id", sticky.id);

    let info = document.createElement("div");
    info.classList.add("sticky-note-info");
    container.appendChild(info);

    let from = document.createElement("div");
    from.classList.add("sticky-note-from");
    from.textContent = sticky.from;
    info.appendChild(from);

    let text = document.createElement("div");
    text.classList.add("sticky-note-text");
    text.textContent = sticky.text;
    container.appendChild(text);

    // Add click event to edit the sticky note
    container.addEventListener("dblclick", (e) => {
      this.editSticky(container);
    });

    this.notes.appendChild(container);
  }

  editSticky(container) {
    let textElement = container.querySelector(".sticky-note-text");
    let newText = prompt("Edit your sticky note:", textElement.textContent);
    if (newText !== null) {
      let stickyId = container.getAttribute("data-id");
      let sticky = this.stickies[stickyId];
      sticky.text = newText;
      textElement.textContent = newText;
      this.sendSticky(sticky);
    }
  }

  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const app = new StickyNotesApp();
  app.boot();
});
