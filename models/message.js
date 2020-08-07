const mongoose = require('mongoose')

const messageSchema = mongoose.Schema(
  {
    content: String,
    seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

const Message = mongoose.model('Message', messageSchema)

module.exports = {
  Message,
}
