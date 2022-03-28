var semver = require('semver');
var _ = require('lodash');
var agent = require('superagent');

var SEMVER = /([0-9]+\.[0-9]+\.[0-9]+)/g;
var TIMEOUT = 20000;
var NOOP = function() {};

module.exports = ScalingoManifestSource;

function ScalingoManifestSource(options) {
  _.extend(this, {
    name: options.name,
    url: [`${options.baseURLs[options.manifestType]}/${options.stack}/manifest.${options.manifestType}`],
    stableRule: options.stableRule,
    all: [],
    stable: [],
    updated: undefined
  }, options);
}

ScalingoManifestSource.prototype.update = function(done) {
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

ScalingoManifestSource.prototype._parse = function(body) {
  var versions = [];
  var version = SEMVER.exec(body);
  do {
    versions.push(version[1])
  } while (version = SEMVER.exec(body))
  versions = _.unique(versions).filter(semver.valid);

  this.all = _.unique(this.all.concat(versions).sort(semver.compare));
  if(this.stableRule) {
    self = this
    this.stable = this.all.filter(function (version) {
      return semver.satisfies(version, self.stableRule)
    });
  }
  this.updated = new Date();
};
