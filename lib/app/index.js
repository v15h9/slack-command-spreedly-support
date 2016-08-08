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


App.prototype.getSlackResponse2 = function(req, res) {
  let app = this
  let reqData = req.query

  return new Promise(function(resolve, reject){

    // Ensure that `text` exists
    if(reqData.text) {

      // Resolving to adhere to Slack's under 3 second response
      resolve('Processing request...')

      let slackData = {
        config  : {
          token       : reqData.token,
          channel     : reqData.channel_id,
          response_url: reqData.response_url
        },
        params  : reqData.text.split(space = ' '),
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
          slackData.message = slack.error
      }

      slack.replyPrivateDelayed(slackData)

    } else {

      // No text provided, respond with help
      resolve(slack.help)
    }
  }.bind(this))
}



// /api/slack/receive?
// token=eWBt3M5LEppw1sfJXocxckr1
// &team_id=T02UQDDL6
// &team_domain=fonteva
// &channel_id=D19FNSJR5
// &channel_name=directmessage
// &user_id=U03GX5H1F
// &user_name=vshah
// &command=%2Fspreedly
// &text=transaction+2342we42q34234234234
// &response_url=https%3A%2F%2Fhooks.slack.com%2Fcommands%2FT02UQDDL6%2F66310586705%2FoQgiMAj27qqyflEwhqJjlRQV"
App.prototype.getSlackResponse = function(req, res) {
  let app = this;
  return new Promise(function(resolve, reject) {
    let text = req.query.text
    if(text !== 'undefined' && text != '') {
      let message = text.split(' ')
      let bot = this.controller.spawn({token: req.query.token, channel: req.query.channel_id})
      let src = {channel: req.query.channel_id, response_url: req.query.response_url}
      switch (message[0]) {
        case 'transaction':
          this.spreedlyClient.showTransaction(message[1], function(err, data){
            let messageToSend;
            if(err){
              messageToSend = err
            } else {
              messageToSend = app.responseFormatter(data, message[0], message[1])
            }

            bot.replyPrivateDelayed(
                src,
                messageToSend,
                function(err){
                  if(err) Logger.info(err)
                }
              )
          })
          break
        case 'gateway':
          this.spreedlyClient.showGateway(message[1], function(err, data){
            let messageToSend;
            if(err){
              messageToSend = err
            } else {
              messageToSend = app.responseFormatter(data, message[0], message[1])
            }

            bot.replyPrivateDelayed(
                src,
                messageToSend,
                function(err){
                  if(err) Logger.info(err)
                }
              )
          })
          break
        case 'payment-method':
          this.spreedlyClient.showPaymentMethod(message[1], function(err, data){
            let messageToSend;
            if(err){
              messageToSend = err
            } else {
              messageToSend = app.responseFormatter(data, message[0], message[1])
            }

            bot.replyPrivateDelayed(
                src,
                messageToSend,
                function(err){
                  if(err) Logger.info(err)
                }
              )
          })
          break
        default:
          bot.replyPrivateDelayed(
            src,
            'Type not recongnized. Only supported types are _transaction_, _gateway_ and _payment-method_.',
            function(err){
              if(err) Logger.info(err)
            }
          )
      }

      resolve('Processing request...')
    } else {
        resolve('Select an option')
    }

  }.bind(this))

}

App.prototype.responseFormatter = function(data, type, token) {
  let message = {'main':[]}
  for(let key in data) {
      let val = data[key]
      if(val !== null && val.constructor === Object) {
        message[key] = []
        for(let subKey in val) {
          message[key].push({'title': subKey, 'value': val[subKey], 'short': true})
        }
        continue
      } else if(val === null || val.constructor === Array) {
        val = JSON.stringify(val)
      }
      message['main'].push({'title': key, 'value': val, 'short': true })
  }
  let messageToSend = {'attachments':[]}
  for(let key in message){
    messageToSend['attachments']
      .push({
        'color' : '#36a64f',
        'pretext': (key === 'main') ? 'Spreedly response for ' + type + ' with token ' + token : key,
        'fields': message[key]
      })
  }
  return messageToSend
}
