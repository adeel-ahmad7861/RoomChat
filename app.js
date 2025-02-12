// require('dotenv').config();
// const http= require("http");
// const express=require("express");
// const path=require('path');
// const {Server}=require("socket.io")
// const app=express();
// const server=http.createServer(app);
// const io=new Server(server);
// //Socket.io
// io.on("connection",(socket)=>{
//   socket.on("usermessage",(message)=>{
//     io.emit("message",message);
//   });
// });
// app.use(express.static(path.resolve("./public")))
// app.use(express.static("/public"));
// app.get('/',(req,res)=>{
//   return res.sendFile("/public/index.html");
// });
// server.listen(process.env.PORT,()=>{
//   console.log(`server start at ${process.env.PORT}`)
// });

require('dotenv').config();
const http= require("http");
const express=require("express");
const path=require('path');
const {Server}=require("socket.io")
const app=express();
const server=http.createServer(app);
const io=new Server(server);
const socketsConnected = new Set();
//socket.io
io.on("connection",onConnected);
function onConnected(socket){
  // console.log(socket.id);
  socketsConnected.add(socket.id);
  io.emit("clients-total",socketsConnected.size)

  socket.on("disconnect",()=>{
    // console.log("Socket disconnected",socket.id)
    socketsConnected.delete(socket.id);
    io.emit("clients-total",socketsConnected.size);
  });
  socket.on("message",(data)=>{
    socket.broadcast.emit("chat-message",data)
  });
  socket.on('feedback', (data) => {
    socket.broadcast.emit('feedback', data)
  })
}

app.use(express.static(path.resolve("./public")))
app.use(express.static("/public"));
app.get('/',(req,res)=>{
  return res.sendFile("/public/index.html");
});
server.listen(process.env.PORT,()=>{
  console.log(`server start at ${process.env.PORT}`)
});