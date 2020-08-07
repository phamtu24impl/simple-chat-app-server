const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
require('dotenv').config()

const userRouter = require('./routes/users')
const conversationRouter = require('./routes/conversations')
const { User } = require('./models/user')
require('./config/db')

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use(async (req, res, next) => {
  if (req.headers.authorization) {
    const currentUserId = req.headers.authorization.split(' ')[1]
    const currentUser = await User.findById(currentUserId)
    req.currentUser = currentUser
  }
  next()
})

app.use('/users', userRouter)
app.use('/conversations', conversationRouter)

module.exports = app
