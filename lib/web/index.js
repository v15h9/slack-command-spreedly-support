const bodyParser = require('body-parser')
const compression = require('compression')
const csrf = require('csurf')
const express = require('express')
const Logger = require('winston')
const path = require('path')
const serveStatic = require('serve-static')
const swig  = require('swig')


// Routers
const botkit = require('./routes/botkit')

module.exports = function Web(app) {
  Logger.info('******* Starting Web')
  let web = express()

  // Express configuration
  web
    .set('view engine', 'html')
    .set('views', __dirname + '/views')

  web
    .engine('html', swig.renderFile)

  // Shared middleware
  web
    .use(compression())
    //.use(logs(app.config.verbose))
    .use(bodyParser.json({limit: '50mb', parameterLimit: 10000, extended: true}))
    .use(bodyParser.urlencoded({ limit: '50mb', parameterLimit: 10000, extended: true }))
    .use(serveStatic(__dirname + '/static'))


  // Routers
  web.use(botkit(app))

  // Security Best Practices
  web.disable('x-powered-by')

  return web
}
