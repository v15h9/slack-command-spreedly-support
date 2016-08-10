var express = require('express');

module.exports = function BotkitRouter(app) {

  return new express.Router()
    .get('/', showHome)
    .get('/api/slack/spreedly', getSpreedlyResponse)
    .get('/api/slack/salesforce', getSalesforceResponse)

  function showHome(req, res, next) {
    res.render('index');
  }

  function getSpreedlyResponse(req, res, next) {

    app
      .getSpreedlyResponse(req, res)
      .then(sendResponse, next)

    function sendResponse(response) {
      res.json(response)
    }

  }

  function getSalesforceResponse(req, res, next) {

    app
      .getSalesforceResponse(req, res)
      .then(sendResponse, next)

    function sendResponse(response) {
      res.json(response)
    }

  }
};
