const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

// Den "namespace-iga" delen
let special = io.of('/special')

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})
app.get('/special', (req, res) => {
    res.sendFile(__dirname + '/special.html')
})

// Vanliga, öppna delen
io.on('connection', (socket) => {
    socket.emit('welcome', {
        greeting: "God dag"
    })
    socket.on('shout to all', (data) => {
        // Använd båda sockets till detta.
        special.emit("till alla", data)
        io.emit("till alla", data)
    })
})


special.on('connection', (socket) => {
    socket.emit('welcome', {
        greeting: "Välkommen till specialsektionen."
    })
    socket.on('from special to all', (data) => {
        // Använd båda sockets till detta.
        special.emit("till alla", data)
        io.emit("till alla", data)
    })
    socket.on('special shout', (data) => {
        io.of('/special').emit('till alla', data)
    })
})

http.listen(8080, () => {
    console.log("Socket-server igång.")
})