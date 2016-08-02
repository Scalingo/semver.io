var semver = require('semver');
var _ = require('lodash');
var agent = require('superagent');

var SEMVER = /Version ([57]+\.[0-9]+\.[0-9]+)/g;
var TIMEOUT = 20000;
var NOOP = function() {};

module.exports = PhpSource;

function PhpSource(options) {
  _.extend(this, {
    name: 'php',
    url: ['https://secure.php.net/ChangeLog-5.php', 'https://secure.php.net/ChangeLog-7.php'],
    all: [],
    stable: [],
    updated: undefined
  }, options);
}

PhpSource.prototype.update = function(done) {
  done = done || NOOP;

  this.url.forEach(function(url) {
    agent
      .get(url)
      .timeout(TIMEOUT)
      .end(parseResponse.bind(this));
  }, this);


  function parseResponse(err, res) {
    if (err) return done(err, false);
    if (!res.text) return done(new Error('No response'), false);
    if (res.status !== 200) return done(new Error('Bad response'), false);

    this._parse(res.text)
    done(undefined, true);
  }
};

PhpSource.prototype._parse = function(body) {
  var versions = [];
  var version = SEMVER.exec(body);
  do {
    versions.push(version[1])
  } while (version = SEMVER.exec(body))
  versions = _.unique(versions).filter(semver.valid);

  this.all = this.all.concat(versions).sort(semver.compare);
  this.stable = this.all.filter(function (version) {
    return semver.satisfies(version, '>=5.6.x') ||
              semver.satisfies(version, '>=7.0.x')
  });
  this.updated = new Date();
};
