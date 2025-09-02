assert = require "assert"
semver = require "semver"
supertest = require "supertest"

App = require "../../lib/app"
Resolver = require "../../lib/resolver"
NginxSource = require "../../lib/sources/nginx"

app = new App({
  nginx: new Resolver(new NginxSource()),
});

failingApp = new App({
  nginx: new Resolver(new NginxSource())
});

describe "Nginx Routes", ->
  describe "Initialization", ->
    it "updates the app", ->
      this.timeout(20000)
      app.resolvers.nginx.update (err, updated) ->
        assert(!err)
        assert(updated)


    it "prime's the failing app's cache", ->
      this.timeout(20000)
      failingApp.resolvers.nginx.update (err, updated) ->
        assert(!err)
        assert(updated)

    it "redirects the failing app to a false endpoint", ->
      this.timeout(20000)
      failingApp.resolvers.nginx.source.url = 'http://nginx.org/fail';
      failingApp.resolvers.nginx.update (err, updated) ->
        assert(err)
        assert(!updated)

  describe "GET /nginx/stable", ->
    it "returns a stable nginx version", ->
      this.timeout(20000)
      supertest(app)
        .get("/nginx/stable")
        .expect(200)
        .expect('Content-Type', /text\/plain/)
        .then (res) ->
          assert semver.valid(res.text)
          assert.equal semver.parse(res.text).minor % 2, 0

  describe "GET /nginx/unstable", ->
    it "returns an unstable nginx version", ->
      supertest(app)
        .get("/nginx/unstable")
        .expect(200)
        .expect('Content-Type', /text\/plain/)
        .then (res) ->
          assert semver.valid(res.text)
          assert.equal semver.parse(res.text).minor%2, 1


  describe "GET /nginx/resolve/1.6.x", ->

    it "returns a 1.6 nginx version", ->
      supertest(app)
        .get("/nginx/resolve/1.6.x")
        .expect(200)
        .expect('Content-Type', /text\/plain/)
        .then (res) ->
          assert semver.valid(res.text)
          assert.equal semver.parse(res.text).minor, 6

  describe "GET /nginx/resolve/~1.7.1", ->
    it "returns a 1.7 nginx version", ->
      supertest(app)
        .get("/nginx/resolve/1.7.x")
        .expect(200)
        .expect('Content-Type', /text\/plain/)
        .then (res) ->
          assert semver.valid(res.text)
          assert.equal semver.parse(res.text).minor, 7
          assert (semver.parse(res.text).patch > 1)

  describe "GET /nginx/resolve/1.7.4", ->
    it "returns the exact version requested", ->
      supertest(app)
        .get("/nginx/resolve/1.7.4")
        .expect(200)
        .expect('Content-Type', /text\/plain/)
        .then (res) ->
          assert.equal res.text, "1.7.4"

  describe "GET /nginx/resolve?range=0.8.x", ->
    it "allows range as a query param", ->
      supertest(app)
        .get("/nginx/resolve?range=0.8.x")
        .expect(200)
        .expect('Content-Type', /text\/plain/)
        .then (res) ->
          return if err
          assert.equal semver.parse(res.text).minor, 8

  describe "GET /nginx.json", ->
    it "returns a JSON with nginx versions info", ->
      supertest(app)
        .get("/nginx.json")
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .then (res) ->
          keys = (k for k of res.body)
          assert 'stable' in keys
          assert 'unstable' in keys
          assert 'all' in keys

