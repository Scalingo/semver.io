process.env.NODE_ENV = 'test'

assert = require "assert"

Source = require "../../lib/sources/node"

inventory = """
[[artifacts]]
version = "0.10.29"

[[artifacts]]
version = "0.11.12"

[[artifacts]]
version = "4.0.0"

[[artifacts]]
version = "4.0.0-rc.1"
"""

describe "Node Source", ->

  describe "default properties", ->

    before ->
      this.s = new Source()

    it "defaults to empty all array", ->
      assert.equal this.s.all.length, 0

    it "default to empty stable array", ->
      assert.equal this.s.stable.length, 0

    it "defaults to the Scalingo buildpack inventory url", ->
      assert.equal this.s.url, 'https://raw.githubusercontent.com/Scalingo/nodejs-buildpack/refs/heads/master/inventory/node.toml'

    it "has never been updated", ->
      assert.ok !this.s.updated

  describe "_parse()", ->

    before ->
      this.s = new Source()
      this.s._parse(inventory)

    it "has an array of all versions", ->
      assert.equal typeof(this.s.all), "object"
      assert.equal this.s.all.length, 4
      assert.equal this.s.all[1], '0.11.12'

    it "has an array of stable versions", ->
      assert.equal typeof(this.s.stable), "object"
      assert.equal this.s.stable.length, 2
      assert.equal this.s.stable[0], '0.10.29'

    it "includes v4.0.0 in stable", ->
      assert.ok(this.s.stable.indexOf('4.0.0') != -1)

    it "has been updated", ->
      assert.ok this.s.updated
