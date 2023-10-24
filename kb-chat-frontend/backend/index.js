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
app.use("/static" , express.static("static"))
app.use(express.urlencoded({ extended: true }));

// app.use(express.static("public"));

// Define a route for the root URL
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
    
});

const users= {}

// Set up a Socket.io connection event
io.on("connection", (socket) => {
    socket.on("new-user-connected",name=>{
        users[socket.id]= name;
        io.emit("new-user-joined",{name:name, socketid:socket.id,users:users})
    })

    socket.on("send-message",message=>{
        io.emit("new-message",{socketid:socket.id, message:message,name:users[socket.id]})
    })

    socket.on("disconnect",()=>{
        io.emit("user-left",users[socket.id])
        delete users[socket.id];
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
