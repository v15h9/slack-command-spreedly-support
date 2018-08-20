const Botkit = require('botkit')
const Logger = require('winston')

function Bot() {
  var options = {
    debug: true,
    logLevel: 7,
    logger: new Logger.Logger({
      transports: [
        new (Logger.transports.Console)(),
        new (Logger.transports.File)({ filename: './bot.log' })
      ]
    })
  }

  // Slack commands
  this.controller = Botkit.slackbot(options)
}

Bot.prototype.init = function(config) {
  this.slack = this.controller.spawn({token: config.token, channel: config.channel_id})
}

Bot.prototype.replyPrivateDelayed = function(data) {
  this.init(data.config)
  let message = (data.message.constructor !== String) ? this.responseFormatter(data.message, data.params[0], data.params[1]) : data.message
  this.slack.replyPrivateDelayed(data.config, message)
}

Bot.prototype.help = function() {
  return helpMessage = {
    'attachments' : [
      {
        'color' : '#36a64f',
        'title' : 'Transaction',
        'text' : '/spreedly [_t_ or _transaction_] [_token_]'
      },
      {
        'color' : '#36a64f',
        'title' : 'Transcript',
        'text': '/spreedly [_ts_ or _transcript_] [_token_]'
      },
      {
        'color' : '#36a64f',
        'title' : 'Gateway',
        'text' : '/spreedly [_g_ or _gateway_] [_token_]'
      },
      {
        'color' : '#36a64f',
        'title' : 'Gateway Transactions',
        'text' : '/spreedly [_gt_ or _gateway-transactions_] [_token_]'
      },
      {
        'color' : '#36a64f',
        'title' : 'Payment Method',
        'text' : '/spreedly [_pm_ or _payment-method_] [_token_]'
      },
      {
        'color' : '#36a64f',
        'title' : 'Payment Method Transactions',
        'text' : '/spreedly [_pmt_ or _payment-method-transactions_] [_token_]'
      }
    ]
  }
}

Bot.prototype.error = function() {
  let help = this.help
  help['attachments'].unshift({'pretext': 'Type not recongnized.'})
  return help
}

Bot.prototype.responseFormatter = function(data, type, token) {
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

module.exports = new Bot()
