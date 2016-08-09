const Botkit = require('botkit')
const Spreedly = require('node-spreedly')
const EventEmitter = require('events')
const Logger = require('winston')
const Promise = require('promise')
const util = require('util')

const slack = require('./botkit')
const spreedly = require('./spreedly')

function App(config) {
  EventEmitter.call(this)
  this.VERIFICATION_TOKEN = 'eWBt3M5LEppw1sfJXocxckr1'
  this.config = config
  this.controller = Botkit.slackbot({
    debug: true,
    logLevel: 7,
    logger: new Logger.Logger({
      transports: [
        new (Logger.transports.Console)(),
        new (Logger.transports.File)({ filename: './bot.log' })
      ]
    })
  })
  this.spreedlyClient = new Spreedly('5qioLVp7qJfaCzf1VB5GuFtplXG', '45iZ7ndqefoSqzEqywJtLymDTMxCeQIFO9aCUYKt58EplZ1LHGYbvmsRy4NZ1ZKO')
  this.onReady()
}

module.exports = function createApp(config) {
  return new App(config)
}

util.inherits(App, EventEmitter)

App.prototype.onReady = function() {
  let self = this
  Logger.info('app.ready')

  // Using setImmediate for EventEmitter to emit
  // before all initialization is complete
  setImmediate(function(){
    self.emit('ready')
  })
}

App.prototype.onLost = function() {
  Logger.info('app.lost')
  this.emit('lost')
}

App.prototype.getSpreedlyResponse = function(req, res) {

  return new Promise(function(resolve, reject){

    // Ensure that `text` exists
    if(req.query.text) {

      // Resolving to adhere to Slack's under 3 second response
      resolve('Processing request...')

      let slackData = {
        config  : {
          token       : req.query.token,
          channel     : req.query.channel_id,
          response_url: req.query.response_url,
          response    : res
        },
        params  : req.query.text.split(space = ' '),
        message : ''
      }

      switch (slackData.params[0]) {
        case 't':
        case 'transaction':
          spreedly.transaction(slackData.params[1])
            .then(function(success){
              slackData.message = success
              slack.replyPrivateDelayed(slackData)
            }, function(error){
              slackData.message = error
              slack.replyPrivateDelayed(slackData)
            })
          break
        case 'g':
        case 'gateway':
          spreedly.gateway(slackData.params[1])
            .then(function(success){
              slackData.message = success
            }, function(error){
              slackData.message = error
          })
          break
        case 'pm':
        case 'payment-method':
          spreedly.paymentMethod(slackData.params[1])
            .then(function(success){
              slackData.message = success
            }, function(error){
              slackData.message = error
          })
          break
        default:
          slackData.message = slack.error()
      }

      slack.replyPrivateDelayed(slackData)

    } else {

      // No text provided, respond with help
      resolve(slack.help())
    }
  }.bind(this))
}
