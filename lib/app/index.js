const Botkit = require('botkit')
const Spreedly = require('node-spreedly')
const EventEmitter = require('events')
const Logger = require('winston')
const Promise = require('promise')
const util = require('util')

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
              messageToSend = {
                "attachments": [
                  {
                    "fallback": JSON.stringify(data),
                    "color": "#36a64f",
                    "pretext": "Spreedly response for transaction token: " + message[1]
                  },
                  {
                    "fields" : app.responseFormatter(data)
                  }
                ]
              }
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
            'Token Unrecognized',
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

App.prototype.responseFormatter = function(data) {
  let message = []
  for(let key in data) {
      let val = JSON.stringify(data[key])
      message.push({"title": key, "value": val, "short": (val.length > 30) })
  }
  return message
}
