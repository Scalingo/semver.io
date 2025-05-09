var semver = require('semver');
var _ = require('lodash');
var agent = require('superagent');
var toml = require('toml');

// Regex copied from semver source LOOSEPLAIN definition with matching groups
// and the optional `v` or `=` initial character removed.
var SEMVER = /[0-9]+\.[0-9]+\.[0-9]+(?:-?(?:[0-9]+|\d*[a-zA-Z-][a-zA-Z0-9-]*)(?:\.(?:[0-9]+|\d*[a-zA-Z-][a-zA-Z0-9-]*))*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?/g;
var TIMEOUT = 20000;
var NOOP = function() {};

module.exports = NodeSource;

function NodeSource(options) {
  _.extend(this, {
    name: 'node',
    url: 'https://raw.githubusercontent.com/Scalingo/nodejs-buildpack/refs/heads/master/inventory/node.toml',
    all: [],
    stable: [],
    updated: undefined
  }, options);
}

NodeSource.prototype.update = function(done) {
  done = done || NOOP;

  agent
    .get(this.url)
    .timeout(TIMEOUT)
    .end(parseResponse.bind(this));

  function parseResponse(err, res) {
    if (err) return done(err, false);
    if (!res.text) return done(new Error('No response'), false);
    if (res.status !== 200) return done(new Error('Bad response'), false);

    if (!this._parse(res.text)) return done(new Error('Parsing error'), false);

    return done(undefined, true);
  }
};

NodeSource.prototype._parse = function(body) {
  try {
    var inventory = toml.parse(body);
  } catch (e) {
    console.error("Parsing error on line " + e.line + ", column " + e.column + ": " + e.message);
    return false;
  }

  const versions = inventory.releases.map(obj => obj.version);

  this.all = versions.sort(semver.compare);
  this.stable = versions.filter(isStable);
  this.updated = new Date();

  return true;

  function isStable(version) {
    return semver.satisfies(version, '>=1.0.0') ||
        (semver.satisfies(version, '<1.0.0') && semver(version).minor % 2 === 0);
  }
};
