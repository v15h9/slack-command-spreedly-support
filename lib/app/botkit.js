const Botkit = require('botkit')
const Logger = require('winston')

const witai  = require('./witai')

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

  // Slack bot
  this.userbot = Botkit.slackbot(options)
}

Bot.prototype.botinit = function() {
  this.userbot.spawn({ token: 'xoxb-91776956356-t5qOsWHpNvCm59JZFfiwC81b' }).startRTM()

  this.userbot.on(['ambient','direct_message','direct_mention','mention'],function(bot,message) {
    witai.wit.converse([message.channel, message.user].join('_'),message.text)
    .then((data) => {
      if(data.entities.constructor === Object && Object.keys(data.entities).length === 0) {
          bot.reply(message, 'Hey! Heyyy! I\'m still learning. Give me a few more tries and I\'ll be your best buddy. I promise.')
      } else {
        bot.reply(message, JSON.stringify(data))
      }

    })
    .catch(console.error)

  })
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
        'pretext' : 'Transaction details: ',
        'fields' : [
          {
            'title': 'Command',
            'value': '/spreedly _transaction_ *TOKEN*',
            'short': false
          }
        ]
      },
      {
        'color' : '#36a64f',
        'pretext' : 'Payment Gateway details: ',
        'fields' : [
          {
            'title': 'Command',
            'value': '/spreedly _gateway_ *TOKEN*',
            'short': false
          }
        ]
      },
      {
        'color' : '#36a64f',
        'pretext' : 'Payment Method details: ',
        'fields' : [
          {
            'title': 'Command',
            'value': '/spreedly _payment-method_ *TOKEN*',
            'short': false
          }
        ]
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
