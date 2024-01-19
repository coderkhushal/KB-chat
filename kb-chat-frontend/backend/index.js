// Import required modules
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

// Create an Express application
const app = express();

// Create an HTTP server using Express app
const server = http.createServer(app);

// Create a Socket.io server by passing the HTTP server instance
const io = socketIo(server);

// Serve static files (if needed)
app.use(express.static("static",    {setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
    }
}}))
app.use(express.urlencoded({ extended: true }));

// app.use(express.static("public"));

// Define a route for the root URL
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
    
});

const rooms= {}
const users= {}
// {
    //socketid: {
        // name: name,
        // roomid:roomid
    // }
// } 

// Set up a Socket.io connection event
io.on("connection", (socket) => {
    socket.on("join-room",(roomid)=>{
        socket.join(roomid)
    })
    socket.on("new-user-connected",(data)=>{
        let {roomid,name}=data
        users[socket.id]={name:name,roomid:roomid}
        if(!rooms[roomid]){

            rooms[roomid]={}
        }
        rooms[roomid][socket.id]= name;
        
        io.to(roomid).emit("new-user-joined",{name:name, socketid:socket.id,users:rooms[roomid]})
    })

    socket.on("send-message",(data)=>{
        let {message, roomid} =data
        io.to(roomid).emit("new-message",{socketid:socket.id, message:message,name:rooms[roomid][socket.id]})
    })

    socket.on("disconnect",()=>{
        io.to(users[socket.id].roomid).emit("user-left",users[socket.id].name)
        
        delete rooms[users[socket.id].roomid][socket.id];
        delete users[socket.id]
    })

//     // Handle events when a user sends a message
//     socket.on("chat message", (msg) => {
//         // Broadcast the message to all connected clients
//         io.emit("chat message", msg);
//     });

//     // Handle disconnection event
//     socket.on("disconnect", () => {
//         console.log("User disconnected");
//     });
// });

})
// Start the server on port 3000
server.listen(3000, () => {
    console.log("Server listening on *:3000");
});
