var bodyParser = require('body-parser');
var compression = require('compression');
var csrf = require('csurf');
var express = require('express');
var http = require('http');
var Logger = require('winston');
var path = require('path');
var serveStatic = require('serve-static');
var Swig  = require('swig');


Swig.setDefaults({ locals: { now: function () { return new Date(); } }});

// Routers
var botkit = require('./routes/botkit');


module.exports = function Web(app) {
  Logger.info('******* Starting Web');
  var web = express();

  // Express configuration
  web
    .set('view engine', 'html')
    .set('views', __dirname + '/views');

  web
    .engine('html', Swig.renderFile);

  // Shared middleware
  web
    .use(compression())
    //.use(logs(app.config.verbose))
    .use(bodyParser.json({limit: '50mb', parameterLimit: 10000, extended: true}))
    .use(bodyParser.urlencoded({ limit: '50mb', parameterLimit: 10000, extended: true }))
    .use(serveStatic(__dirname + '/static'));


  // Routers
  web.use(botkit(app));

  // Shared error handling
  /*web
    .use(errs.notFound)
    .use(errs.log)
    .use(errs.json)
    .use(errs.html);*/

  // Security Best Practices
  web.disable('x-powered-by');

  return web;
};
