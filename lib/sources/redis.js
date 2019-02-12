var semver = require('semver');
var _ = require('lodash');
var agent = require('superagent');

var SEMVER = / redis-([0-9]+\.[0-9]+\.[0-9]+)\.tar.gz/g;
var TIMEOUT = 20000;
var NOOP = function() {};

module.exports = RedisSource;

function RedisSource(options) {
  _.extend(this, {
    name: 'redis',
    url: 'https://raw.githubusercontent.com/antirez/redis-hashes/master/README',
    all: [],
    stable: [],
    updated: undefined
  }, options);
}

RedisSource.prototype.update = function(done) {
  done = done || NOOP;

  agent
    .get(this.url)
    .timeout(TIMEOUT)
    .end(parseResponse.bind(this));

  function parseResponse(err, res) {
    if (err) return done(err, false);
    if (!res.text) return done(new Error('No response'), false);
    if (res.status !== 200) return done(new Error('Bad response'), false);

    this._parse(res.text)
    done(undefined, true);
  }
};

RedisSource.prototype._parse = function(body) {
  var versions = [];
  var version = SEMVER.exec(body);
  do {
    versions.push(version[1])
  } while (version = SEMVER.exec(body))
  versions = _.unique(versions).filter(semver.valid);

  this.all = _.unique(this.all.concat(versions).sort(semver.compare));
  this.stable = this.all.filter(function (version) {
    return semver.satisfies(version, '>=3.7.x')
  });
  this.updated = new Date();
};
