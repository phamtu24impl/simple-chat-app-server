const express = require('express')

const { Message } = require('../models/message')
const { Conversation } = require('../models/conversation')
const { User } = require('../models/user')

const errorBoundary = require('./errorBoundary')
const socket = require('../socket')

const router = express.Router()

router.post(
  '/',
  errorBoundary(async (req, res) => {
    const findOrCreateConversation = async (members) => {
      const allConversations = await Conversation.find({}).populate('members')
      const matchedConversation = allConversations.find((conversation) =>
        // eslint-disable-next-line no-underscore-dangle
        conversation.members.every((member) => members.some((currentMember) => currentMember._id.equals(member._id)))
      )

      return matchedConversation || new Conversation({ members }).save()
    }

    const otherMembers = await User.find().byUsername(req.body.members)
    const conversation = await findOrCreateConversation([...otherMembers, req.currentUser])

    otherMembers.forEach((member) => {
      socket.io.to(`${member._id}/conversations`).emit('newConversation', { conversation })
    })
    res.send(conversation)
  })
)

router.get(
  '/',
  errorBoundary(async (req, res) => {
    const conversations = await Conversation.find({})
      .populate('members')
      .populate({
        path: 'messages',
        populate: ['sender', 'seenBy'],
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
)

router.get(
  '/:id/messages',
  errorBoundary(async (req, res) => {
    const conversation = await Conversation.findById(req.params.id).populate('messages')
    res.send(conversation.messages)
  })
)

router.post(
  '/:id/messages',
  errorBoundary(async (req, res) => {
    const conversation = await Conversation.findById(req.params.id)
    const message = new Message({ content: req.body.content, sender: req.currentUser, conversation })
    await message.save()
    conversation.messages.push(message)
    await conversation.save()
    socket.io.to(`conversations/${conversation._id}`).emit('newMessage', { conversation, message })
    conversation.members.forEach((member) => {
      if (member._id.equals(req.currentUser._id)) {
        return
      }

      socket.io.to(`${member._id}/conversations`).emit('newLatestMessage', { conversation, message })
    })
    res.send(message)
  })
)

module.exports = router
