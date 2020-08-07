const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  username: { type: String, index: true },
})

userSchema.query.byUsername = function findByUsername(username) {
  return this.where({ username })
}

const User = mongoose.model('User', userSchema)

module.exports = {
  User,
}
