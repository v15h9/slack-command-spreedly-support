
function App(config) {
  EventEmitter.call(this);
  this.VERIFICATION_TOKEN = 'eWBt3M5LEppw1sfJXocxckr1';
  this.config = config;
  this.controller = Botkit.slackbot({});
  this.bot = this.controller.spawn({token: this.VERIFICATION_TOKEN});
  this.spreedlyClient = new Spreedly('5qioLVp7qJfaCzf1VB5GuFtplXG', '45iZ7ndqefoSqzEqywJtLymDTMxCeQIFO9aCUYKt58EplZ1LHGYbvmsRy4NZ1ZKO');
  this.onReady();
}

module.exports = function createApp(config) {
  return new App(config);
};

Util.inherits(App, EventEmitter);

App.prototype.onReady = function() {
  Logger.info('app.ready');
  this.emit('ready');
};

App.prototype.onLost = function() {
  Logger.info('app.lost');
  this.emit('lost');
};

App.prototype.getSlackResponse = function(req, res) {
  return new Promise(function(resolve, reject) {
    Logger.info(JSON.stringify(req));
    resolve('You are here');
  });

}
