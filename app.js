const express = require('express')
const app = express()

app.set('port', 3000)
app.use(express.static('public'))

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
})

var server = app.listen(app.get('port'), function () {
  var port = server.address().port
  console.log('real-time-user-app running on port ' + port)
})

const io = require('socket.io')(server)

var users = {}

io.on('connection', socket => {
  socket.on('add_user', name => {
    console.log(`A user is online - ${name}`)
    socket.user = name
    users[name] = name
    if (name) {
      socket.broadcast.emit('online_user', name)
    }
  })
  socket.on('disconnect', function () {
    delete users[socket.user]
    console.log(`user ${socket.user} disconnect`)
    socket.broadcast.emit('offline_user', socket.user)
  })
})
