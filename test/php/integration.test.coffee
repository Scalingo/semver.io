assert = require "assert"
semver = require "semver"
supertest = require "supertest"

App = require "../../lib/app"
Resolver = require "../../lib/resolver"
PhpSource = require "../../lib/sources/php"

app = new App({
  php: new Resolver(new PhpSource()),
});

failingApp = new App({
  php: new Resolver(new PhpSource())
});

describe "PHP Routes", ->

  describe "Initialization", ->

    it "updates the app", (done) ->
      this.timeout(20000)
      app.resolvers.php.update (err, updated) ->
        assert(!err)
        assert(updated)
        done()

    it "prime's the failing app's cache", (done) ->
      this.timeout(20000)
      failingApp.resolvers.php.update (err, updated) ->
        assert(!err)
        assert(updated)
        done()

    it "redirects the failing app to a false endpoint", (done) ->
      this.timeout(30000)
      failingApp.resolvers.php.source.url = [
        'https://fail.invalid/ChangeLog-5.php',
        'https://fail.invalid/ChangeLog-7.php'
      ]
      failingApp.resolvers.php.update (err, updated) ->
        assert(err)
        assert(!updated)
        done()

  describe "GET /php/stable", ->

    it "returns a stable PHP version", ->
      supertest(app)
        .get("/php/stable")
        .expect(200)
        .expect('Content-Type', /text\/plain/)
        .then (res) ->
          assert semver.valid(res.text)

    it "works with a failing endpoint", ->
      supertest(failingApp)
        .get("/php/stable")
        .expect(200)
        .expect('content-type', /text\/plain/)
        .then (res) ->
          assert semver.valid(res.text)

  describe "GET /php/unstable", ->

    it "returns an unstable PHP version", ->
      supertest(app)
        .get("/php/unstable")
        .expect(200)
        .expect('Content-Type', /text\/plain/)
        .then (res) ->
          assert semver.valid(res.text)

    it "works with a failing endpoint", ->
      supertest(failingApp)
        .get("/php/unstable")
        .expect(200)
        .expect('Content-Type', /text\/plain/)
        .then (res) ->
          assert semver.valid(res.text)

  describe "GET /php/resolve/5.6.x", ->

    it "returns a 5.6 PHP version", ->
      supertest(app)
        .get("/php/resolve/5.6.x")
        .expect(200)
        .expect('Content-Type', /text\/plain/)
        .then (res) ->
          assert semver.valid(res.text)
          assert.equal semver.parse(res.text).major, 5
          assert.equal semver.parse(res.text).minor, 6

    it "works with a failing endpoint", ->
      supertest(failingApp)
        .get("/php/resolve/5.6.x")
        .expect(200)
        .expect('Content-Type', /text\/plain/)
        .then (res) ->
          assert semver.valid(res.text)
          assert.equal semver.parse(res.text).major, 5
          assert.equal semver.parse(res.text).minor, 6

  describe "GET /php/resolve/~5.6.3", ->

    it "returns a 5.6 PHP version", ->
      supertest(app)
        .get("/php/resolve/~5.6.3")
        .expect(200)
        .expect('Content-Type', /text\/plain/)
        .then (res) ->
          assert semver.valid(res.text)
          assert.equal semver.parse(res.text).major, 5
          assert.equal semver.parse(res.text).minor, 6
          assert semver.parse(res.text).patch > 3

    it "works with a failing endpoint", ->
      supertest(failingApp)
        .get("/php/resolve/~5.6.3")
        .expect(200)
        .expect('Content-Type', /text\/plain/)
        .then (res) ->
          assert semver.valid(res.text)
          assert.equal semver.parse(res.text).major, 5
          assert.equal semver.parse(res.text).minor, 6
          assert semver.parse(res.text).patch > 3

  describe "GET /php/resolve/5.6.20", ->

    it "returns the exact version requested", ->
      supertest(app)
        .get("/php/resolve/5.6.20")
        .expect(200)
        .expect('Content-Type', /text\/plain/)
        .then (res) ->
          assert.equal res.text, "5.6.20"

    it "works with a failing endpoint", ->
      supertest(failingApp)
        .get("/php/resolve/5.6.20")
        .expect(200)
        .expect('Content-Type', /text\/plain/)
        .then (res) ->
          assert.equal res.text, "5.6.20"

  describe "GET /php/resolve?range=5.6.x", ->

    it "allows range as a query param", ->
      supertest(app)
        .get("/php/resolve?range=5.6.x")
        .expect(200)
        .expect('Content-Type', /text\/plain/)
        .then (res) ->
          assert.equal semver.parse(res.text).major, 5
          assert.equal semver.parse(res.text).minor, 6

    it "works with a failing endpoint", ->
      supertest(app)
        .get("/php/resolve?range=5.6.x")
        .expect(200)
        .expect('Content-Type', /text\/plain/)
        .then (res) ->
          assert.equal semver.parse(res.text).major, 5
          assert.equal semver.parse(res.text).minor, 6

  describe "GET /php.json", ->

    it "returns JSON with stable, unstable, versions, updated", ->
      supertest(app)
        .get("/php.json")
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .then (res) ->
          assert.equal typeof(res.body.stable), "string"
          assert.equal typeof(res.body.unstable), "string"
          assert.equal typeof(res.body.all), "object"
          assert.equal typeof(res.body.updated), "string"
          assert.ok res.body.all.length

    it "works with a failing endpoint", ->
      supertest(failingApp)
        .get("/php.json")
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .then (res) ->
          assert.equal typeof(res.body.stable), "string"
          assert.equal typeof(res.body.unstable), "string"
          assert.equal typeof(res.body.all), "object"
          assert.equal typeof(res.body.updated), "string"
          assert.ok res.body.all.length
