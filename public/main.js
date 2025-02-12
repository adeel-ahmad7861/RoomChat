const socket =io() 
const messageContainer=document.getElementById("message-container")
const nameInput=document.getElementById("name-input")
const messageForm=document.getElementById("message-form")
const messageInput=document.getElementById("message-input")
const messageTone = new Audio('/message-tone.mp3')
messageForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    sendmessage()
})

//form server side
const clientsTotal=document.getElementById("client-total")
socket.on("clients-total",(data)=>{
     clientsTotal.innerText = `Total Clients: ${data}`
})
//from client side
function sendmessage(){
    if(messageInput.value === '')return
    // console.log(messageInput.value);
    const data={
        name:nameInput.value,
        message:messageInput.value,
        dateTime:new Date()
    }
    socket.emit("message",data);
    

    addMessageTouI(true,data)
    
    messageInput.value=' '
}
//from server side
socket.on("chat-message",(data)=>{
    // console.log(data)
    messageTone.play()
    addMessageTouI(false,data);
})

function addMessageTouI(isOwnMessage,data){
    clearFeedback()
    const element=`<li class="${isOwnMessage ? "message-left" : "message-right"}">
          <p class="message">
             ${data.message}
            <span>${data.name} ● ${moment(data.dateTime)}.fromNow()}</span>
          </p>
        </li>
`
    messageContainer.innerHTML+=element
    scrollToBottom()
}

function scrollToBottom(){
    messageContainer.scrollTo(0,messageContainer.scrollHeight)
}

messageInput.addEventListener('focus', (e) => {
    socket.emit('feedback', {
      feedback: `✍️ ${nameInput.value} is typing a message`,
    })
  })
  
  messageInput.addEventListener('keypress', (e) => {
    socket.emit('feedback', {
      feedback: `✍️ ${nameInput.value} is typing a message`,
    })
  })
  messageInput.addEventListener('blur', (e) => {
    socket.emit('feedback', {
      feedback: '',
    })
  })
  //from serve side
  socket.on('feedback', (data) => {
    clearFeedback()
    const element = `
          <li class="message-feedback">
            <p class="feedback" id="feedback">${data.feedback}</p>
          </li>
    `
    messageContainer.innerHTML += element
  })
  
  function clearFeedback() {
    document.querySelectorAll('li.message-feedback').forEach((element) => {
      element.parentNode.removeChild(element)
    })
  }
  