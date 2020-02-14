const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

// Här ska vi spara info om anslutningarna
let socketInfo = []
// Här sparar vi info från req-objektet som vi hämtar i app.get.... och nyttjar i io.on()...
let userAgent = ""

// Serva en html-fil
app.get('/', (req, res) => {
    userAgent = req.header('user-agent')
    res.sendFile(__dirname + "/index.html")
})

io.on('connection', (socket) => {
    let newSocket = {}
    newSocket.userAgent = userAgent
    newSocket.id = socket.id
    socketInfo.push(newSocket)
    socket.broadcast.emit('info', {
        connections: socketInfo.length
    })
    socket.on('disconnect', (reason) => {
        // Leta fram rätt index.
        let socketIndex = socketInfo.findIndex(s => socket.id == s.id)
        // Ta bort det objektet ur socketInfo
        socketInfo.splice(socketIndex, 1)
        socket.broadcast.emit('info', {
            connections: socketInfo.length
        })
    })
})




server.listen(8080, () => {
    console.log("Socket 3 rullar hårt.")
})