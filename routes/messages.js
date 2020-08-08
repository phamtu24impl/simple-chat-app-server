const express = require('express')

const { Message } = require('../models/message')

const errorBoundary = require('./errorBoundary')

const router = express.Router()

router.put(
  '/:id/seen',
  errorBoundary(async (req, res) => {
    const message = await Message.findById(req.params.id)
    message.seenBy.push(req.currentUser)
    await message.save()

    res.send(message)
  })
)

module.exports = router
