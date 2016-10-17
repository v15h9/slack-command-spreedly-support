const Promise = require('promise')
const Wit     = require('node-wit').Wit

function Witai() {
  const accessToken = 'MN6PLGEB6KPGTLCVIAPAGBCREWLDFNTJ'

  const actions = {
    send(request, response) {
      const {sessionId, context, entities} = request
      const {text, quickreplies} = response
      return new Promise(function(resolve, reject) {
        console.log('user said...', request.text)
        console.log('sending...', JSON.stringify(response))
        return resolve()
      })
    }
  }

  this.wit = new Wit({accessToken, actions})
}

module.exports = new Witai()
