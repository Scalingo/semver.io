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

    it "updates the app", () ->
      this.timeout(20000)
      app.resolvers.php.update (err, updated) ->
        assert(!err)
        assert(updated)

    it "prime's the failing app's cache", () ->
      this.timeout(20000)
      failingApp.resolvers.php.update (err, updated) ->
        assert(!err)
        assert(updated)

    it "redirects the failing app to a false endpoint", () ->
      this.timeout(30000)
      failingApp.resolvers.php.source.registry = 'https://fail.php.net/';
      failingApp.resolvers.php.update (err, updated) ->
        assert(err)
        assert(!updated)

  describe "GET /php/stable", ->

    it "returns a stable PHP version", (done) ->
      supertest(app)
        .get("/php/stable")
        .expect(200)
        .expect('Content-Type', /text\/plain/)
        .end (err, res) ->
          return done(err) if err
          assert semver.valid(res.text)
          done()

    it "works with a failing endpoint", (done) ->
      supertest(failingApp)
        .get("/php/stable")
        .expect(200)
        .expect('content-type', /text\/plain/)
        .end (err, res) ->
          return done(err) if err
          assert semver.valid(res.text)
          done()

  describe "GET /php/unstable", ->

    it "returns an unstable PHP version", (done) ->
      supertest(app)
        .get("/php/unstable")
        .expect(200)
        .expect('Content-Type', /text\/plain/)
        .end (err, res) ->
          return done(err) if err
          assert semver.valid(res.text)
          done()

    it "works with a failing endpoint", (done) ->
      supertest(failingApp)
        .get("/php/unstable")
        .expect(200)
        .expect('Content-Type', /text\/plain/)
        .end (err, res) ->
          return done(err) if err
          assert semver.valid(res.text)
          done()

  describe "GET /php/resolve/5.6.x", ->

    it "returns a 5.6 PHP version", (done) ->
      supertest(app)
        .get("/php/resolve/5.6.x")
        .expect(200)
        .expect('Content-Type', /text\/plain/)
        .end (err, res) ->
          return done(err) if err
          assert semver.valid(res.text)
          assert.equal semver(res.text).major, 5
          assert.equal semver(res.text).minor, 6
          done()

    it "works with a failing endpoint", (done) ->
      supertest(failingApp)
        .get("/php/resolve/5.6.x")
        .expect(200)
        .expect('Content-Type', /text\/plain/)
        .end (err, res) ->
          return done(err) if err
          assert semver.valid(res.text)
          assert.equal semver(res.text).major, 5
          assert.equal semver(res.text).minor, 6
          done()

  describe "GET /php/resolve/~5.6.3", ->

    it "returns a 5.6 PHP version", (done) ->
      supertest(app)
        .get("/php/resolve/~5.6.3")
        .expect(200)
        .expect('Content-Type', /text\/plain/)
        .end (err, res) ->
          return done(err) if err
          assert semver.valid(res.text)
          assert.equal semver(res.text).major, 5
          assert.equal semver(res.text).minor, 6
          assert semver(res.text).patch > 3
          done()

    it "works with a failing endpoint", (done) ->
      supertest(failingApp)
        .get("/php/resolve/~5.6.3")
        .expect(200)
        .expect('Content-Type', /text\/plain/)
        .end (err, res) ->
          return done(err) if err
          assert semver.valid(res.text)
          assert.equal semver(res.text).major, 5
          assert.equal semver(res.text).minor, 6
          assert semver(res.text).patch > 3
          done()

  describe "GET /php/resolve/5.6.20", ->

    it "returns the exact version requested", (done) ->
      supertest(app)
        .get("/php/resolve/5.6.20")
        .expect(200)
        .expect('Content-Type', /text\/plain/)
        .end (err, res) ->
          return done(err) if err
          assert.equal res.text, "5.6.20"
          done()

    it "works with a failing endpoint", (done) ->
      supertest(failingApp)
        .get("/php/resolve/5.6.20")
        .expect(200)
        .expect('Content-Type', /text\/plain/)
        .end (err, res) ->
          return done(err) if err
          assert.equal res.text, "5.6.20"
          done()

  describe "GET /php/resolve?range=5.6.x", ->

    it "allows range as a query param", (done) ->
      supertest(app)
        .get("/php/resolve?range=5.6.x")
        .expect(200)
        .expect('Content-Type', /text\/plain/)
        .end (err, res) ->
          return done(err) if err
          assert.equal semver.parse(res.text).major, 5
          assert.equal semver.parse(res.text).minor, 6
          done()

    it "works with a failing endpoint", (done) ->
      supertest(app)
        .get("/php/resolve?range=5.6.x")
        .expect(200)
        .expect('Content-Type', /text\/plain/)
        .end (err, res) ->
          return done(err) if err
          assert.equal semver.parse(res.text).major, 5
          assert.equal semver.parse(res.text).minor, 6
          done()

  describe "GET /php.json", ->

    it "returns JSON with stable, unstable, versions, updated", (done) ->
      supertest(app)
        .get("/php.json")
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .end (err, res) ->
          return done(err) if err
          assert.equal typeof(res.body.stable), "string"
          assert.equal typeof(res.body.unstable), "string"
          assert.equal typeof(res.body.all), "object"
          assert.equal typeof(res.body.updated), "string"
          assert.ok res.body.all.length
          done()

    it "works with a failing endpoint", (done) ->
      supertest(failingApp)
        .get("/php.json")
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .end (err, res) ->
          return done(err) if err
          assert.equal typeof(res.body.stable), "string"
          assert.equal typeof(res.body.unstable), "string"
          assert.equal typeof(res.body.all), "object"
          assert.equal typeof(res.body.updated), "string"
          assert.ok res.body.all.length
          done()
