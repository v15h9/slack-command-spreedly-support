require('./includes');

var
  app = require('./app'),
  config = require('./config'),
  web = require('./web');

http.globalAgent.maxSockets = Infinity;
throng({ workers: config.concurrency, start: start });

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
    Logger.info('**** Creating Server');
    //if (config.thrifty) instance.startListening();
    var server = http.createServer(web(instance));

    process.on('SIGTERM', shutdown);
    instance
      .removeListener('lost', abort)
      .on('lost', shutdown);

    server.listen(config.port, onListen);

    function onListen() {
      Logger.info({ msg: 'listening', port: server.address().port });
    }

    function shutdown() {
      Logger.info('shutting down');
      server.close(function() {
        Logger.info('exiting');
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
