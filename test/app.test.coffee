assert = require "assert"
semver = require "semver"
supertest = require "supertest"

App = require "../lib/app"

app = new App()
failingApp = new App()

describe "App", ->

  describe "GET /", ->

    it "renders the readme", ->
      supertest(app)
        .get("/")
        .expect(200)

    it "adds CORS headers (fix #10)", ->
      supertest(app)
        .get("/node.json")
        .expect(200)
        .expect('Access-Control-Allow-Origin', '*')
