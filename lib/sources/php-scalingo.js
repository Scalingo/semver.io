var semver = require('semver');
var _ = require('lodash');
var agent = require('superagent');

var SEMVER = /([0-9]+\.[0-9]+\.[0-9]+)/g;
var TIMEOUT = 20000;
var NOOP = function() {};

module.exports = PhpScalingoSource;

function PhpScalingoSource(options) {
  _.extend(this, {
    name: 'php-scalingo',
    url: ['https://storage.sbg1.cloud.ovh.net/v1/AUTH_be65d32d71a6435589a419eac98613f2/scalingo-php-buildpack/manifest.php'],
    all: [],
    stable: [],
    updated: undefined
  }, options);
}

PhpScalingoSource.prototype.update = function(done) {
  done = done || NOOP;

  agent
    .get(this.url[0])
    .responseType('text/plain')
    .timeout(TIMEOUT)
    .end(parseResponse.bind(this));

  function parseResponse(err, res) {
    if (err) return done(err, false);
    res.text = res.body.toString();
    if (!res.text) return done(new Error('No response'), false);
    if (res.status !== 200) return done(new Error('Bad response'), false);

    this._parse(res.text);
    done(undefined, true);
  }
};

PhpScalingoSource.prototype._parse = function(body) {
  var versions = [];
  var version = SEMVER.exec(body);
  do {
    versions.push(version[1])
  } while (version = SEMVER.exec(body))
  versions = _.unique(versions).filter(semver.valid);

  this.all = _.unique(this.all.concat(versions).sort(semver.compare));
  this.stable = this.all.filter(function (version) {
    return semver.satisfies(version, '>=5.6.x') ||
              semver.satisfies(version, '>=7.2.x')
  });
  this.updated = new Date();
};
