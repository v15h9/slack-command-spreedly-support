/**
* @desc Start file for Web Server
* @author Vishal Shah
*/


// Packages
const http = require('http')
const Logger = require('winston')
const Throng = require('throng')

const app = require('./app')
const config = require('./config')
const web = require('./web')


http.globalAgent.maxSockets = Infinity
Throng({ workers: config.concurrency, start: start })

function start() {
  Logger.info('starting server', { concurrency: config.concurrency, thrifty: config.thrifty})

  var instance = app(config)
  instance.on('ready', createServer)

  function createServer() {
    Logger.info('**** Creating Server')

    var server = http.createServer(web(instance))

    process.on('SIGTERM', shutdown)

    server.listen(config.port, onListen)

    function onListen() {
      Logger.info('listening', { port: server.address().port })
    }

    function shutdown() {
      Logger.info('shutting down')
      server.close(function() {
        Logger.info('exiting')
        process.exit()
      })
    }
  }
}
