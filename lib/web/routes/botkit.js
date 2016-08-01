var express = require('express');
var path = require('path');


module.exports = function BotkitRouter(app) {

  return new express.Router()
    .get('/', showHome)
    .get('/api/slack/receive', getSlackResponse);

  function showHome(req, res, next) {
    res.render('index');
  }

  function getSlackResponse(req, res, next) {

    app
      .getSlackResponse(req, res)
      .then(sendResponse, next)

    function sendResponse(response) {
      res.json(response);
    }

  }
};
