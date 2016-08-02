process.env.NODE_ENV = 'test'

assert = require "assert"
semver = require "semver"
fs = require "fs"

Source = require "../../lib/sources/php"
body = fs.readFileSync(__dirname + '/../fixtures/php.html').toString();

describe "PHP Source", ->

  describe "default properties", ->

    before ->
      this.s = new Source()

    it "defaults to empty all array", ->
      assert.equal this.s.all.length, 0

    it "default to empty stable array", ->
      assert.equal this.s.stable.length, 0

    it "has never been updated", ->
      assert.ok !this.s.updated

  describe "_parse()", ->

    before ->
      this.s = new Source()
      this.s._parse(body)

    it "has an array of all versions", ->
      assert.equal typeof(this.s.all), "object"
      assert.equal this.s.all.length, 10
      assert.equal this.s.all[0], '7.0.0'

    it "has an array of stable versions", ->
      assert.equal typeof(this.s.stable), "object"
      assert.equal this.s.stable.length, 10

    it "shows version 7.0.9 as the latest stable", ->
      assert.equal this.s.stable[9], '7.0.9'

    it "has been updated", ->
      assert.ok this.s.updated
