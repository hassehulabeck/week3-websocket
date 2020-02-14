const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

// Express för att serva en webbsida (klienten)
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

// När vi kört igång och en klient kopplar upp sig, skicka en hälsning.
io.on("connection", (socket) => {
    socket.emit('new client', {
        greeting: "Välkommen, kära klient"
    })
    socket.on('other event', (data) => {
        console.log(data)
    })
})

// Medan http sköter socket-servern. Socket.io kan inte fästas till express.
server.listen(8080, () => {
    console.log("Servern är igång")
})