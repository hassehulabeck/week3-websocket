const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const words = ["Giraff", "Oxe", "Blåval", "Ödla", "Katt", "Frigolit"]

// Express för att serva en webbsida (klienten)
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

io.on('connection', (socket) => {
    let i = 0;
    socket.emit('greeting', {
        msg: "Hello"
    })
    setInterval(() => {
        if (i == words.length)
            i = 0;
        socket.emit('freeWord', {
            word: words[i]
        })
        i++
    }, 5000)
})



server.listen(8080, () => {
    console.log("Socket-servern är redo")
})