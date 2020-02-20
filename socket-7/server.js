const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

const questions = require('./questions.json')

let socketCounter = 0
let questCounter = 0
let playersReady = 0 // För att avgöra när vi ska skicka fråga 2, 3 osv.
let timerStart
let timerEnd

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile('index.html')
})

io.on('connection', (socket) => {
    socketCounter++
    socket.emit('setup', socket.id)

    if (socketCounter >= 2) {
        timer = new Date().getTime()
        io.emit('ask', {
            q: questions[questCounter].question,
            i: questCounter
        })
    }

    socket.on('answer', (svar) => {
        let timerEnd = new Date().getTime()
        let seconds = (timerEnd - timerStart) / 1000
        if (svar.a == questions[questCounter].answer) {
            io.emit('correct', {
                time: seconds,
                winner: socket.id
            })
        }
        questCounter++
    })

    socket.on('new question', () => {
        playersReady++
        if (playersReady == socketCounter) {
            if ((questCounter / socketCounter) < questions.length) {
                io.emit('ask', {
                    q: questions[questCounter].question,
                    i: questCounter
                })
                playersReady = 0
            } else {
                io.emit('end')
            }
        }
    })
})



http.listen(8080, () => {
    console.log("Lyssnar på 8080")
})