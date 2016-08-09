const Promise = require('promise')
const Spreedly = require('node-spreedly')

let SpreedlyClient = function () {
    this.instance = new Spreedly('5qioLVp7qJfaCzf1VB5GuFtplXG', '45iZ7ndqefoSqzEqywJtLymDTMxCeQIFO9aCUYKt58EplZ1LHGYbvmsRy4NZ1ZKO')
}

SpreedlyClient.prototype.transaction = function (token) {
  this.instance.showTransaction(token)
    .then(function(success) {
      return new Promise.resolve(success)
    }, function(error){
      return new Promise.reject(error)
    })
}

SpreedlyClient.prototype.gateway = function (token) {
  this.instance.showGateway(token)
    .then(function(success) {
      return new Promise.resolve(success)
    }, function(error){
      return new Promise.reject(error)
    })
}

SpreedlyClient.prototype.paymentMethod = function (token) {
  this.instance.showPaymentMethod(token)
    .then(function(success) {
      return new Promise.resolve(success)
    }, function(error){
      return new Promise.reject(error)
    })
}

module.exports = new SpreedlyClient();
