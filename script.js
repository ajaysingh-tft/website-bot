let BASE_URL="https://efe5-103-106-153-143.ngrok-free.app/scrape/",socket;console.log("no import regressions, you're quite smart!");export const initializeBot=({apiKey:e,projectId:t})=>{if(console.log("api key",e),"theapikeyisbeyondyourpayscale"===e){console.log("api key valid, initializing bot");let a=localStorage.getItem("project_id")||t;a?(console.log("project_id found, establishing ws conn."),startWebSocketConnection()):(console.log("project_id not found in local storage, initiating scraping..."),scrape(),startWebSocketConnection())}else console.log("invalid api key")};function scrape(){fetch("https://efe5-103-106-153-143.ngrok-free.app/scrape//scrape/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:"https://www.tftus.com"})}).then(e=>e.json()).then(e=>{console.log("res",e),localStorage.setItem("project_id",e.project_id),startWebSocketConnection(e.project_id)}).catch(e=>{console.error("Scraping error:",e)})}function startWebSocketConnection(){let e=localStorage.getItem("project_id")||"38573121-f1df-49ed-8670-f22855d81d0e",t=`wss://neat-bars-mix.loca.lt/ws/chat/${e}/`;(socket=new WebSocket(t)).addEventListener("open",e=>{console.log("Connected to the WebSocket server"),a(!0)}),socket.addEventListener("message",e=>{console.log("Received message from server:",e);let t=JSON.parse(e.data);console.log("data",t),sendBotMessage(t.message)}),socket.addEventListener("close",e=>{console.log("Connection closed:",e),a(!1)});let a=e=>{let t=document.getElementById("connection-status");e?(t.textContent="Connected",t.style.color="#6eff6e"):(t.textContent="Disconnected",t.style.color="red")}}startWebSocketConnection();let chatContainer=document.createElement("div");chatContainer.classList.add("chat-container"),document.body.appendChild(chatContainer);let chatHeader=document.createElement("div");chatHeader.classList.add("chat-header"),chatHeader.textContent="Chat with us";let connectionStatus=document.createElement("p");connectionStatus.id="connection-status",connectionStatus.textContent="Connecting...",chatHeader.appendChild(connectionStatus),chatContainer.appendChild(chatHeader);let chatMessages=document.createElement("div");chatMessages.classList.add("chat-messages"),chatMessages.id="chat-messages",chatContainer.appendChild(chatMessages);let chatInputContainer=document.createElement("div");chatInputContainer.classList.add("chat-input"),chatContainer.appendChild(chatInputContainer);let userInput=document.createElement("input");userInput.type="text",userInput.id="user-input",userInput.placeholder="Type your message...",chatInputContainer.appendChild(userInput);let sendButton=document.createElement("button");sendButton.textContent="▶",sendButton.id="sendButton",chatInputContainer.appendChild(sendButton);let styleElement=document.createElement("style");styleElement.textContent=`
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
`,document.head.appendChild(styleElement),sendButton.addEventListener("click",()=>{sendUserMessage(userInput.value)}),userInput.addEventListener("keypress",e=>{"Enter"===e.key&&sendUserMessage(userInput.value)});let sendUserMessage=async e=>{try{await socket.send(JSON.stringify({message:e}))}catch(t){throw console.error("Failed to send message:",t),t}let a=e;if(""!==e.trim()){let n=document.createElement("div");n.classList.add("user-message-wrapper");let s=document.createElement("div");s.classList.add("message");let o=document.createElement("div");o.classList.add("chat-message"),o.innerText=a;let i=document.createElement("div"),r=document.createElement("span");i.classList.add("message-meta"),r.id="time",r.textContent=new Date().toLocaleTimeString();let d=document.createElement("span");d.id="author",d.textContent="Batman",i.appendChild(r),i.appendChild(d),s.appendChild(o),s.appendChild(i),n.appendChild(s),chatMessages.appendChild(n),userInput.value="",n.scrollIntoView({behavior:"smooth",block:"end"})}},sendBotMessage=e=>{if(""!==e.trim()){let t=document.createElement("div");t.classList.add("bot-message-wrapper");let a=document.createElement("div");a.classList.add("message");let n=document.createElement("div");n.classList.add("bot-message"),n.innerText=e;let s=document.createElement("div"),o=document.createElement("span");s.classList.add("message-meta"),o.id="time",o.textContent=new Date().toLocaleTimeString();let i=document.createElement("span");i.id="author",i.textContent="bot",s.appendChild(o),s.appendChild(i),a.appendChild(n),a.appendChild(s),t.appendChild(a),chatMessages.appendChild(t),t.scrollIntoView({behavior:"smooth",block:"end"})}};
