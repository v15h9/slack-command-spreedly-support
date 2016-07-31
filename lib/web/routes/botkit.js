module.exports = function BotkitRouter(app) {

  return new Express.Router()
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