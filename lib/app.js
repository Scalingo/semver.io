var _ = require('lodash');
var logfmt = require('logfmt');
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');

var router = require('./router');
var render = require('./render');
var Resolver = require('./resolver');

var NodeSource = require('./sources/node');
var IoJsSource = require('./sources/iojs');
var NpmSource = require('./sources/npm');
var YarnSource = require('./sources/yarn');
var NginxSource = require('./sources/nginx');
var MongoDBSource = require('./sources/mongodb');
var RedisSource = require('./sources/redis');
var PythonSource = require('./sources/python');
var RubySource = require('./sources/ruby');
var PhpSource = require('./sources/php');
var ScalingoManifestSource = require('./sources/scalingo-manifest');

module.exports = function App(resolvers) {
  var app = express();
  manifestBaseOptions = {
    baseURL: process.env.MANIFEST_BASE_URL || 'https://storage.sbg.cloud.ovh.net/v1/AUTH_be65d32d71a6435589a419eac98613f2/scalingo-php-buildpack',
  }
  var resolvers = resolvers || {
    node: new Resolver(new NodeSource()),
    iojs: new Resolver(new IoJsSource()),
    npm: new Resolver(new NpmSource()),
    "nginx-scalingo-18": new Resolver(new ScalingoManifestSource(_.merge(manifestBaseOptions, {
      name: 'nginx-scalingo-18',
      stack: 'scalingo-18',
      manifestFile: 'manifest.nginx',
      stableRule: '~1.18',
    }))),
    "nginx-scalingo-14": new Resolver(new ScalingoManifestSource(_.merge(manifestBaseOptions, {
      name: 'nginx-scalingo-14',
      stack: 'scalingo-14',
      manifestFile: 'manifest.nginx',
      stableRule: '~1.18',
    }))),
    nginx: new Resolver(new NginxSource()),
    mongodb: new Resolver(new MongoDBSource()),
    redis: new Resolver(new RedisSource()),
    yarn: new Resolver(new YarnSource()),
    "php-scalingo-18": new Resolver(new ScalingoManifestSource(_.merge(manifestBaseOptions, {
      name: 'php-scalingo-18',
      stack: 'scalingo-18',
      manifestFile: 'manifest.php',
      stableRule: '>= 7.2',
    }))),
    "php-scalingo-14": new Resolver(new ScalingoManifestSource(_.merge(manifestBaseOptions, {
      name: 'php-scalingo-14',
      stack: 'scalingo-14',
      manifestFile: 'manifest.php',
      stableRule: '>= 7.2',
    }))),
    php: new Resolver(new PhpSource()),
    ruby: new Resolver(new RubySource()),
    python: new Resolver(new PythonSource()),
  };

  app.resolvers = resolvers;

  if (process.env.NODE_ENV !== 'test') {
    app.use(logfmt.requestLogger());
  }

  app
    .use(cors())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .get('/', renderInstructions)
    .get('/ssl', sendSSL);

  Object.keys(resolvers).forEach(function attachRouter(key) {
    app.use('/' + key + ':format?', router(resolvers[key]));
  });

  return app;

  function renderInstructions(req, res, next) {
    render(resolvers, onRender);

    function onRender(err, html) {
      if (err) throw err;
      res.send(html);
    }
  }

  function sendSSL(req, res, next) {
    res.type('text');
    res.send([
      '"Demonstration of domain control for DigiCert order #00462258"',
      '"Please send the approval email to: ops@heroku.com"'
    ].join('\n'));
  }
};
