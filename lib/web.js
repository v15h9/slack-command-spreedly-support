require('./includes');

var
  app = require('./app'),
  config = require('./config'),
  web = require('./web');

Http.globalAgent.maxSockets = Infinity;
Throng({ workers: config.concurrency, start: start });

function start() {
  Logger.info({
    msg: 'starting server',
    concurrency: config.concurrency,
    thrifty: config.thrifty
  });

  var instance = app(config);
  instance.on('ready', createServer);
  instance.on('lost', abort);

  function createServer() {
    //if (config.thrifty) instance.startListening();
    var server = Http.createServer(web(instance));
    instance.createSocket(server);

    process.on('SIGTERM', shutdown);
    instance
      .removeListener('lost', abort)
      .on('lost', shutdown);

    server.listen(config.port, onListen);

    function onListen() {
      logger.log({ type: 'info', msg: 'listening', port: server.address().port });
    }

    function shutdown() {
      logger.log({ type: 'info', msg: 'shutting down' });
      server.close(function() {
        logger.log({ type: 'info', msg: 'exiting' });
        process.exit();
      });
    }
  }

  function abort() {
    logger.log({ type: 'info', msg: 'shutting down', abort: true });
    process.exit();
  }

  function socketCreated() {
    logger.log({ type: 'info', msg: 'socket created' });
  }
}
