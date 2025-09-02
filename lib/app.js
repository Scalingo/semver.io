var _ = require('lodash');
var logfmt = require('logfmt');
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');

var router = require('./router');
var render = require('./render');
var Resolver = require('./resolver');

var NodeSource = require('./sources/node');
var NginxSource = require('./sources/nginx');
var PythonSource = require('./sources/python');
var RubySource = require('./sources/ruby');
var PhpSource = require('./sources/php');
var ScalingoManifestSource = require('./sources/scalingo-manifest');

module.exports = function App(resolvers) {
  var app = express();

  manifestBaseOptions = {
    "baseURLs": {
      "php": process.env.PHP_MANIFEST_BASE_URL || 'https://storage.gra.cloud.ovh.net/v1/AUTH_be65d32d71a6435589a419eac98613f2/scalingo-php-buildpack',
      "composer": process.env.COMPOSER_MANIFEST_BASE_URL || 'https://storage.gra.cloud.ovh.net/v1/AUTH_be65d32d71a6435589a419eac98613f2/scalingo-php-buildpack',
      "nginx": process.env.NGINX_MANIFEST_BASE_URL || 'https://nginx-buildpack.s3.amazonaws.com',
    }
  }

  var resolvers = resolvers || {
    "nginx-scalingo-24": new Resolver(new ScalingoManifestSource(_.merge(_.clone(manifestBaseOptions), {
      name: 'nginx-scalingo-24',
      stack: 'scalingo-24',
      manifestType: "nginx",
      stableRule: '~1.28',
    }))),
    "nginx-scalingo-22-minimal": new Resolver(new ScalingoManifestSource(_.merge(_.clone(manifestBaseOptions), {
      name: 'nginx-scalingo-22-minimal',
      stack: 'scalingo-22-minimal',
      manifestType: "nginx",
      stableRule: '~1.28',
    }))),
    "nginx-scalingo-22": new Resolver(new ScalingoManifestSource(_.merge(_.clone(manifestBaseOptions), {
      name: 'nginx-scalingo-22',
      stack: 'scalingo-22',
      manifestType: "nginx",
      stableRule: '~1.28',
    }))),
    "nginx-scalingo-20-minimal": new Resolver(new ScalingoManifestSource(_.merge(_.clone(manifestBaseOptions), {
      name: 'nginx-scalingo-20-minimal',
      stack: 'scalingo-20-minimal',
      manifestType: "nginx",
      stableRule: '~1.26',
    }))),
    "nginx-scalingo-20": new Resolver(new ScalingoManifestSource(_.merge(_.clone(manifestBaseOptions), {
      name: 'nginx-scalingo-20',
      stack: 'scalingo-20',
      manifestType: "nginx",
      stableRule: '~1.26',
    }))),
    "nginx-scalingo-18": new Resolver(new ScalingoManifestSource(_.merge(_.clone(manifestBaseOptions), {
      name: 'nginx-scalingo-18',
      stack: 'scalingo-18',
      manifestType: "nginx",
      stableRule: '~1.20',
    }))),
    "php-scalingo-24": new Resolver(new ScalingoManifestSource(_.merge(_.clone(manifestBaseOptions), {
      name: 'php-scalingo-24',
      stack: 'scalingo-24',
      manifestType: "php",
      stableRule: '~8.1',
    }))),
    "php-scalingo-22": new Resolver(new ScalingoManifestSource(_.merge(_.clone(manifestBaseOptions), {
      name: 'php-scalingo-22',
      stack: 'scalingo-22',
      manifestType: "php",
      stableRule: '~8.1',
      legacyRule: '< 8.1',
    }))),
    "php-scalingo-20": new Resolver(new ScalingoManifestSource(_.merge(_.clone(manifestBaseOptions), {
      name: 'php-scalingo-20',
      stack: 'scalingo-20',
      manifestType: "php",
      stableRule: '~8.1',
    }))),
    "php-scalingo-18": new Resolver(new ScalingoManifestSource(_.merge(_.clone(manifestBaseOptions), {
      name: 'php-scalingo-18',
      stack: 'scalingo-18',
      manifestType: "php",
      stableRule: '~7.4',
    }))),
    "composer-scalingo-24": new Resolver(new ScalingoManifestSource(_.merge(_.clone(manifestBaseOptions), {
      name: 'composer-scalingo-24',
      stack: 'scalingo-24',
      manifestType: 'composer',
      stableRule: '2.x',
    }))),
    "composer-scalingo-22": new Resolver(new ScalingoManifestSource(_.merge(_.clone(manifestBaseOptions), {
      name: 'composer-scalingo-22',
      stack: 'scalingo-22',
      manifestType: 'composer',
      stableRule: '2.x',
    }))),
    "composer-scalingo-20": new Resolver(new ScalingoManifestSource(_.merge(_.clone(manifestBaseOptions), {
      name: 'composer-scalingo-20',
      stack: 'scalingo-20',
      manifestType: 'composer',
      stableRule: '2.x',
    }))),
    "composer-scalingo-18": new Resolver(new ScalingoManifestSource(_.merge(_.clone(manifestBaseOptions), {
      name: 'composer-scalingo-18',
      stack: 'scalingo-18',
      manifestFile: 'composer',
      stableRule: '2.x',
    }))),
    php: new Resolver(new PhpSource()),
    nginx: new Resolver(new NginxSource()),
    node: new Resolver(new NodeSource()),
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
    .get('/', renderInstructions);

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
};
