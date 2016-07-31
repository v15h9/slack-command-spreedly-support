Swig.setDefaults({ locals: { now: function () { return new Date(); } }});

// Routers
var botkit = require('./routes/botkit'),


module.exports = function Web(app) {
  Logger.info('******* Starting Web');
  var web = Express();

  // Express configuration
  web
    .set('view engine', 'html')
    .set('views', __dirname + '/views');

  web
    .engine('html', Swig.renderFile);

  // Shared middleware
  web
    .use(Compression())
    //.use(logs(app.config.verbose))
    .use(BodyParser.json({limit: '50mb', parameterLimit: 10000, extended: true}))
    .use(BodyParser.urlencoded({ limit: '50mb', parameterLimit: 10000, extended: true }))
    .use(ServeStatic(__dirname + '/static'));


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
