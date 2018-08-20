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

SpreedlyClient.prototype.transcript = function (token) {
  return this.instance.showTranscript(token)
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

SpreedlyClient.prototype.paymentGatewayTransactions = function (token) {
  return this.instance.gatewayTransactions(token)
    .then(function(success) {
      console.log('success in call', success )
      return new Promise.resolve(success)
    }, function(error){
      console.log('error in call', error )
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

SpreedlyClient.prototype.paymentMethodTransactions = function (token) {
  return this.instance.getPaymentMethodTransactions(token)
    .then(function(success) {
      return new Promise.resolve(success)
    }, function(error){
      return new Promise.reject(error)
    })
}

module.exports = new SpreedlyClient();
