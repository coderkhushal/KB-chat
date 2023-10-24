const socket = io()
const name = prompt("enter your name")
const messagecontainer= document.querySelector(".messagecontainer")
const usercontainer= document.querySelector(".personscontainer")
//new user joined event emission
socket.emit("new-user-connected",name)

//new user joined even listening
socket.on("new-user-joined",data=>{
    if(data.socketid!=socket.id){
    console.log("user with name",data.name,"is joined")
    let announcement = document.createElement("div")
    announcement.classList.add("announcement")
    announcement.innerText= `${data.name} has joined`
    messagecontainer.appendChild(announcement)
    
    }
    //clearing users
    usercontainer.innerText=""

    //appending in users
    for(i in data.users){
        let user= document.createElement("li")
        user.innerText= data.users[i]
        usercontainer.appendChild(user)
    }
})

//handling sending messages
messagebox= document.getElementById("messagebox")
document.getElementById("submitbtn").addEventListener("click",()=>{
    if(messagebox.value!=""){
        socket.emit("send-message",messagebox.value)
        sentmessage = document.createElement("div")
        sentmessage.classList.add("right","text")
        sentmessage.innerText= messagebox.value;
        messagecontainer.appendChild(sentmessage)
        messagebox.value=""
    }
})


//recieving incoming messages
socket.on("new-message",data=>{
    if(data.socketid!=socket.id){
        let messagerecieved = document.createElement("div")
        messagerecieved.classList.add("left","text")
        messagerecieved.innerText= data.name+"\n"+data.message
        messagecontainer.appendChild(messagerecieved)
        console.log(data.message)
    }
})

//listening disconnection event
socket.on("user-left",user=>{
    
    let announcement = document.createElement("div")
    announcement.classList.add("announcement")
    announcement.innerText= `${user} disconnected`
    messagecontainer.appendChild(announcement)
    //deleting user from users
    let elements=Array.from( document.getElementsByTagName("li"))
    for(i of elements){
        if(i.innerText==user){
            i.remove();
            break;
        }
    }
    
})