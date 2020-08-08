const Server = require('socket.io')
const { User } = require('./models/user')

class Socket {
  init(server) {
    const io = new Server(server)

    io.use((socket, next) => {
      const { userId } = socket.handshake.query

      User.findById(userId)
        .then((currentUser) => {
          // eslint-disable-next-line no-param-reassign
          socket.currentUser = currentUser
          next()
        })
        .catch(() => next(new Error('Unauthenticated')))
    })

    io.on('connection', (socket) => {
      const currentUserId = socket.currentUser._id

      console.log('socket connected', currentUserId)

      socket.join(`${currentUserId}/conversations`)

      socket.on('joinConversation', (data) => {
        console.log('join conversation', data.id)
        socket.join(`conversations/${data.id}`)
      })

      socket.on('leaveConversation', (data) => {
        console.log('leave conversation', data.id)
        socket.leave(`conversations/${data.id}`)
      })

      socket.on('typing', () => {})

      socket.on('disconnect', () => {
        socket.leaveAll()
        console.log('user disconnected')
      })
    })

    this.io = io
  }
}

module.exports = new Socket()
