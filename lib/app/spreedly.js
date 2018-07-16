const Logger = require('winston')
const Promise = require('promise')
const Spreedly = require('node-spreedly')

let SpreedlyClient = function () {
    this.instance = new Spreedly(process.env.ENVIRONMENT_KEY, process.env.ACCESS_SECRET)
}

SpreedlyClient.prototype.transaction = function (token) {
  return this.instance.showTransaction(token)
    .then(function(success) {
      return new Promise.resolve(success)
    }, function(error){
      return new Promise.reject(error)
    })
}

SpreedlyClient.prototype.gateway = function (token) {
  return this.instance.showGateway(token)
    .then(function(success) {
      return new Promise.resolve(success)
    }, function(error){
      return new Promise.reject(error)
    })
}

SpreedlyClient.prototype.paymentMethod = function (token) {
  return this.instance.showPaymentMethod(token)
    .then(function(success) {
      return new Promise.resolve(success)
    }, function(error){
      return new Promise.reject(error)
    })
}

module.exports = new SpreedlyClient();
