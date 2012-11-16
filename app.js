var express = require('express')
  , flash = require('connect-flash')  
  , passport = require('passport')
  , logger = require('winston')  
  , RedisStore = require('connect-redis')(express)
  , cluster = require('cluster')
  , os = require('os')
  , config = require('./config')
  , routes = require('./routes')
  , db = require('./modules/db') 
;

var app = module.exports = express();

// Configuration
app.configure(function() {
  app.use(express.logger({format: config.logging.express_format}));  
  app.use(express.compress()); // use gzip compression on static assets
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {layout: false});
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  if (config.logging.winston_mongodb) {
    logger.remove(logger.transports.Console);
    require('winston-mongodb').MongoDB; // mongo transport for winston logging
    logger.add(logger.transports.MongoDB, config.logging.winston_mongodb);
    // Consider letting Winstong log transport handle uncaught exceptions: https://github.com/flatiron/winston#handling-uncaught-exceptions-with-winston
  }    
  var session_config;
  if (config.redis) {
    logger.info('Connecting to Redis at ' 
      + config.redis.session_opts.host + ':' 
      + config.redis.session_opts.port);
    session_config = {     
      store: new RedisStore(config.redis.session_opts),     
      secret: config.redis.session_secret
    }
  } else {
    logger.warn('Redis not configured. Storing sessions in memory. See config.redis');
    session_config = {
      secret: 'default memstore session secret'
    }    
  };
  app.use(express.session(session_config));    
  app.use(passport.initialize());
  app.use(passport.session());  
  app.use(flash()); // must go before app.router
  // express3 style dynamic helpers in middleware:
  app.use(function(req, res, next) {
    res.locals.title = config.app.title;
    res.locals.user = req.user;
    res.locals.flash = req.flash();
    next();
  });    
  app.use(app.router);  
  app.use(express.static(__dirname + '/public', {maxAge: 86400000})); // cache static assets 1 day
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Map http routes to endpoints:
routes(app);

var startApp = function() {
  var protocol = config.app.ssl ? 'https' : 'http';
  var port = process.env.PORT || config.app.port;
  var app_url = protocol + '://' + config.app.host + ':' + port;
  var env = process.env.NODE_ENV ? ('[' + process.env.NODE_ENV + ']') : '';  
  app.listen(port, function() {
    logger.info(config.app.title + ' listening at ' + app_url + ' ' + env);
  });
}

var startCluster = function (onWorker, onDeath) {
  if (cluster.isMaster) {
    // Fork workers: 1 http listener per CPU (core), all sharing the same port.
    logger.info('Initializing ' + os.cpus().length + ' workers in this cluster.');
    for (var i = 0; i < os.cpus().length; i++) {
      cluster.fork();
    }
    cluster.on('death', onDeath);
  } else {
    onWorker();
  }
};
  
if (config.app.cluster) {
  startCluster(startApp, function(worker) {    
    winston.error('worker ' + worker.pid + ' died'); // A worker process died 
  });
} else {
  startApp();
}