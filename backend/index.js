const express = require('express')
const app = express()
const winston = require('winston')

require('./startup/logging')()
require('./startup/config')()
require('./startup/routes')(app)
require('./startup/db')()
require('./startup/validation')()
require('./startup/prod')(app)

let port = null

if (process.env.NODE_ENV !== 'test') {
  port = process.env.PORT || 3000
} else {
  port = 3001
}

const server = app.listen(port, () =>
  winston.info(`Server listening on port ${port} ... `)
)

module.exports = server
