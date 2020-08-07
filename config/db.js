const mongoose = require('mongoose')

mongoose.Promise = global.Promise

const db = mongoose.connection

mongoose.connect(`mongodb://${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME}?authSource=admin`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  user: process.env.DATABASE_USERNAME,
  pass: process.env.DATABASE_PASSWORD,
})

db.on('error', (err) => {
  console.log('DB connection error:', err.message)
})

db.once('open', function () {
  console.log('Connected to Db')
})

module.exports = { db }
