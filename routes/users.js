const express = require('express')

const { User } = require('../models/user')

const errorBoundary = require('./errorBoundary')

const router = express.Router()

router.post(
  '/sign_in',
  errorBoundary(async (req, res) => {
    const findOrCreateUser = async (username) => {
      const user = await User.findOne().byUsername(username)
      return user || new User({ username: req.body.username }).save()
    }

    const user = await findOrCreateUser(req.body.username)
    res.send(user)
  })
)

module.exports = router
