const express = require("express")
const { chats } = require("./data/data")
const dotenv = require("dotenv")
const connectdb = require("./config/db")
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes')
const app = express()
const {notFound, errorHandler} = require('./middlewares/errorMiddleware')
const path = require('path')
const cors = require('cors');

dotenv.config({path: "backend/.env"})
connectdb()
app.use(express.json()) //to accept json data


app.use("/api/user", userRoutes)
app.use("/api/chat", chatRoutes)
app.use("/api/message", messageRoutes)
app.use(cors({
    origin: 'https://mern-chat-app-1-cju7.onrender.com', // Change to your frontend URL
    methods: ['GET', 'POST', 'PUT'],
    credentials: true
  }));
// ------------------DEPLOYMENT----------------

const __dirname1 = path.resolve()
if(process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
    app.use(express.static(path.join(__dirname1, "/frontend/build")))
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
    })
} else {
    app.get("/", (req, res) => {
        res.send("API is running")
    })
}
// --------------------------------------------

app.use(notFound)
app.use(errorHandler)



const PORT = process.env.PORT || 4000

const server = app.listen(PORT, console.log(`Server started on Port ${PORT}`))

const io = require('socket.io')(server, {
    pingTimeout:60000,
    cors: {
        origin: "https://mern-chat-app-1-cju7.onrender.com",
        methods: ['GET', 'POST'],
        credentials: true
    },
})

io.on("connection", (socket) => {
    console.log("connected to socket.io")

    socket.on("setup", (userData) => {
        socket.join(userData._id)
        console.log(userData._id)
        socket.emit("connected")
    })

    socket.on("join chat", (room) => {
        socket.join(room)
        console.log("User joined Room : " + room)
    })

    socket.on("typing", (room) => socket.in(room).emit("typing"))
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"))

    socket.on("new message", (newMessageReceived) => {
        var chat = newMessageReceived.chat
        if(!chat.users) {
            return console.log("chat.users not defined") //testing
        }

        chat.users.forEach(user => {
            if(user._id == newMessageReceived.sender._id) {
                return
            }
            socket.in(user._id).emit("message recieved", newMessageReceived)
        })
    })

    socket.off("setup", () => {
        console.log("User Disconnected")
        socket.leave(userData._id)
    })
})