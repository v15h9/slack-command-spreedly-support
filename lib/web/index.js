const bodyParser = require('body-parser')
const compression = require('compression')
const express = require('express')
const Logger = require('winston')
const path = require('path')


// Routers
const botkit = require('./routes/botkit')

module.exports = function Web(app) {
  Logger.info('******* Starting Web')
  let web = express()

  // Express configuration
  web
    .set('views', __dirname + '/views')

  // Shared middleware
  web
    .use(compression())
    .use(bodyParser.json({limit: '50mb', parameterLimit: 10000, extended: true}))
    .use(bodyParser.urlencoded({ limit: '50mb', parameterLimit: 10000, extended: true }))
    .use(express.static(__dirname + '/views'))

  // Routers
  web.use(botkit(app))

  // Security Best Practices
  web.disable('x-powered-by')

  return web
}
