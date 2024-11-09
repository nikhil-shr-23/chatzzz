const express = require('express')
const path = require('path')
const http = require('http')
const socketIo = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketIo(server)

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => console.log(`💬 server on port ${PORT}`));
app.use(express.static(path.join(__dirname, 'public')))

let socketsConected = new Set()

io.on('connection', onConnected)

function onConnected(socket) {
  console.log('Socket connected', socket.id)
  socketsConected.add(socket.id)
  io.emit('clients-total', socketsConected.size)

  socket.on('disconnect', () => {
    console.log('Socket disconnected', socket.id)
    socketsConected.delete(socket.id)
    io.emit('clients-total', socketsConected.size)
  })

  socket.on('message', (data) => {
    // console.log(data)
    socket.broadcast.emit('chat-message', data)
  })

  socket.on('feedback', (data) => {
    socket.broadcast.emit('feedback', data)
  })
}
