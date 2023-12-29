const BASE_URL = "https://efe5-103-106-153-143.ngrok-free.app/";
let socket;
console.log('no file import errors')
  export const initializeBot = ({ apiKey }) => {
    if(apiKey === "theapikeyisbeyondyourpayscale") {
      console.log("api key valid, initializing bot")
      const project_id = localStorage.getItem("project_id")
      if (!project_id) {
        console.log("project_id not found in local storage, initiating scraping...");
        scrape();
        startWebSocketConnection();
      } else {
        console.log("project_id found, establishing ws conn.")
        startWebSocketConnection();
      }
    } else {
      console.log("invalid api key")
    }
  }

  function scrape() {
    fetch(`${BASE_URL}/scrape/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: "https://www.tftus.com",
      }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log('res', responseData);
        localStorage.setItem("project_id", responseData.project_id);
        startWebSocketConnection(responseData.project_id);
      })
      .catch((err) => {
        console.error("Scraping error:", err);
      });
  }

  function startWebSocketConnection() {
    const project_id = localStorage.getItem("project_id") || "38573121-f1df-49ed-8670-f22855d81d0e"
    const webSocketUrl = `wss://neat-bars-mix.loca.lt/ws/chat/${project_id}/`;

    socket = new WebSocket(webSocketUrl);

    socket.addEventListener("open", (event) => {
      console.log("Connected to the WebSocket server");
      updateConnectionStatus(true);
    });

    socket.addEventListener("message", (event) => {
      console.log("Received message from server:", event);
      const data = JSON.parse(event.data);
      console.log('data', data);
      sendBotMessage(data.message);
    });

    socket.addEventListener("close", (event) => {
      console.log("Connection closed:", event);
      updateConnectionStatus(false);
    });

    const updateConnectionStatus = (isConnected) => {
      const connectionStatusElement = document.getElementById("connection-status");
      if (isConnected) {
        connectionStatusElement.textContent = "Connected";
        connectionStatusElement.style.color = "#6eff6e";
      } else {
        connectionStatusElement.textContent = "Disconnected";
        connectionStatusElement.style.color = "red";
      }
    };
  }

  const chatContainer = document.createElement("div");
  chatContainer.classList.add("chat-container");
  document.body.appendChild(chatContainer);

  const chatHeader = document.createElement("div");
  chatHeader.classList.add("chat-header");
  chatHeader.textContent = "Chat with us";
  const connectionStatus = document.createElement("p")
  connectionStatus.id = 'connection-status'
  connectionStatus.textContent = "Connecting..."
  chatHeader.appendChild(connectionStatus);

  chatContainer.appendChild(chatHeader);

  const chatMessages = document.createElement("div");
  chatMessages.classList.add("chat-messages");
  chatMessages.id = "chat-messages";
  chatContainer.appendChild(chatMessages);

  const chatInputContainer = document.createElement("div");
  chatInputContainer.classList.add("chat-input");
  chatContainer.appendChild(chatInputContainer);

  const userInput = document.createElement("input");
  userInput.type = "text";
  userInput.id = "user-input";
  userInput.placeholder = "Type your message...";
  chatInputContainer.appendChild(userInput);

  const sendButton = document.createElement("button");
  sendButton.textContent = "▶";
  sendButton.id = "sendButton";
  chatInputContainer.appendChild(sendButton);

  const styleElement = document.createElement("style");
  styleElement.textContent = `
  body {
    font-family: Arial, sans-serif;
    position: relative;
  } 
  .chat-container {
    background: #fff;
    position: fixed;
    right: 10px;
    bottom: 10px;
    height: 420px;
    width: 300px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  } 
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #1d71d4;
    border-radius: 5px;
    color: white;
    padding-left: 10px;
    padding-right: 10px;
  } 
  .chat-messages {
    padding: 10px;
    height: 300px;
    overflow-y: scroll;
  } 
  #loader{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 290px;
  }
  .chat-input {
    display: flex;
    padding: 6px;
    background-color: #fff;
  }
  input {
    flex: 10;
    padding: 10px;
    margin-right: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  button {
    padding: 8px;
    flex: 1;
    background-color: #1d71d4;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  } 
  button:hover {
    background-color: #055ec5;
  }
  .user-message-wrapper{
    display: flex;
    justify-content: flex-end;
  }
  .bot-message-wrapper {
    display: flex;
    justify-content: flex-start;
  }
  .message {
    max-width: 90%;
  }
  .chat-message{
    display: block;
    background-color: #04438c;
    color: white;
    padding: 8px 15px;
    margin: 5px;
    border-radius: 10px;
    border-bottom-right-radius: 0px;
  }
  .bot-message {
    background-color: #ECECEC;
    border-radius: 10px;
    border-bottom-left-radius: 0px;
    margin: 5px;
    padding: 8px 15px;
  }
  .message-meta {
    margin: 5px;
    display: flex;
  }
  .user-message-wrapper .message-meta {
    justify-content: flex-end;
  }
  .message-meta #time {
    font-size: 12px;
  }
  .message-meta #author {
    margin-left: 10px;
    font-size: 12px;
    font-weight: bold;
  }
  .chat-message, .bot-message {
    font-size: 14px;
  }
`;

  document.head.appendChild(styleElement);

  sendButton.addEventListener("click", () => {
    sendUserMessage(userInput.value)
  });

  userInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      sendUserMessage(userInput.value)
    }
  });

  const sendUserMessage = async (msg) => {
    try {
      await socket.send(JSON.stringify({ message: msg }));
    } catch (error) {
      console.error("Failed to send message:", error);
      throw error;
    }
    const InputMessage = msg;
    if (msg.trim() !== "") {
      const userMesageWrapper = document.createElement("div")
      userMesageWrapper.classList.add("user-message-wrapper")

      const message = document.createElement("div")
      message.classList.add("message")

      const chatMessage = document.createElement("div");
      chatMessage.classList.add("chat-message");
      chatMessage.innerText = InputMessage;

      const messageMeta = document.createElement("div");

      const timeStamp = document.createElement("span")
      messageMeta.classList.add("message-meta");

      timeStamp.id = 'time'
      timeStamp.textContent = new Date().toLocaleTimeString()

      const author = document.createElement("span")
      author.id = 'author'
      author.textContent = "Batman"

      messageMeta.appendChild(timeStamp)
      messageMeta.appendChild(author)

      message.appendChild(chatMessage)
      message.appendChild(messageMeta)

      userMesageWrapper.appendChild(message)
      chatMessages.appendChild(userMesageWrapper);
      userInput.value = "";
      userMesageWrapper.scrollIntoView({ behavior: "smooth", block: "end" })
    }
  }

  const sendBotMessage = (msg) => {
    if (msg.trim() !== "") {
      const botMesageWrapper = document.createElement("div")
      botMesageWrapper.classList.add("bot-message-wrapper")

      const message = document.createElement("div")
      message.classList.add("message")

      const chatMessage = document.createElement("div");
      chatMessage.classList.add("bot-message");
      chatMessage.innerText = msg;

      const messageMeta = document.createElement("div");

      const timeStamp = document.createElement("span")
      messageMeta.classList.add("message-meta");

      timeStamp.id = 'time'
      timeStamp.textContent = new Date().toLocaleTimeString()

      const author = document.createElement("span")
      author.id = 'author'
      author.textContent = "bot"

      messageMeta.appendChild(timeStamp)
      messageMeta.appendChild(author)

      message.appendChild(chatMessage)
      message.appendChild(messageMeta)

      botMesageWrapper.appendChild(message)
      chatMessages.appendChild(botMesageWrapper);

      botMesageWrapper.scrollIntoView({ behavior: "smooth", block: "end" })
    }
  }
