const express = require('express')

const { Message } = require('../models/message')
const { Conversation } = require('../models/conversation')
const { User } = require('../models/user')

const router = express.Router()

router.post('/', async (req, res) => {
  const otherMembers = await User.find().byUsername(req.body.members)
  const conversation = new Conversation({
    members: [...otherMembers, req.currentUser],
  })
  await conversation.save()
  res.send(conversation)
})

router.get('/', async (req, res) => {
  const conversations = await Conversation.find({})
    .populate('members')
    .populate({
      path: 'messages',
      options: {
        limit: 1,
        sort: { createdAt: -1 },
      },
    })
  res.send(
    conversations.filter((conversation) =>
      conversation.members.some((member) => {
        // eslint-disable-next-line no-underscore-dangle
        return member._id.equals(req.currentUser._id)
      })
    )
  )
})

router.get('/:id/messages', async (req, res) => {
  const conversation = await Conversation.findById(req.params.id).populate('messages')
  res.send(conversation.messages)
})

router.post('/:id/messages', async (req, res) => {
  const conversation = await Conversation.findById(req.params.id)
  const message = new Message({ content: req.body.content, sender: req.currentUser, conversation })
  await message.save()
  conversation.messages.push(message)
  await conversation.save()
  res.send(message)
})

module.exports = router
