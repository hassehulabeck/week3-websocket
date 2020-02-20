const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
let stocks = require('./stocks.json')

const fs = require('fs')
const uuid = require('uuid/v1')

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})


io.on('connection', (socket) => {
    socket.emit('aktuell lista', stocks)

    socket.on('new bid', (data) => {
        data.id = uuid
        stocks[matchingStock.id].bids.push(data);
        writeStocks(stocks)
    })

    socket.on('write to file', (data) => {
        writeStocks(data)
    })
})

function writeStocks(data) {
    fs.writeFile('./stocks.json', JSON.stringify(data), 'utf8', (err) => {
        if (err)
            console.error(err)
        else {
            console.log("Filen uppdaterad")
            io.emit('aktuell lista', data)
        }
    })
}

http.listen(8080, () => {
    console.log("Aktiebörsen är igång")
})