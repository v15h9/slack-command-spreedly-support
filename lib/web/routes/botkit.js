var express = require('express');

module.exports = function BotkitRouter(app) {

  return new express.Router()
    .get('/', showHome)
    .get('/api/slack/receive', getSlackResponse);

  function showHome(req, res, next) {
    res.render('index');
  }

  function getSlackResponse(req, res, next) {

    app
      .getSlackResponse2(req, res)
      .then(sendResponse, next)

    function sendResponse(response) {
      res.json(response);
    }

  }
};
