# semver.io

semver.io is a plaintext and JSON webservice
that tracks all available versions of
[node.js](/node/versions),
[iojs](/iojs/versions),
[npm](/npm/versions),
[yarn](/yarn/versions),
[nginx](/nginx/versions),
[mongodb](/mongodb/versions),
and [PHP](/php/versions).
It uses that version info to resolve
[semver range queries](https://npmjs.org/doc/misc/semver.html#Ranges).
It's used by Heroku's
[node buildpack](https://github.com/heroku/heroku-buildpack-nodejs/blob/5754e60de7b8472d5070c9b713a898d353845c68/bin/compile#L18-22)
and is open-sourced [on GitHub](https://github.com/heroku/semver.io).

## Other sources

Semver.io uses a simple and short module system to pull version data from a variety of sources.
Pull requests are welcome!
You can start with one of the current implementations as a template:

- [node module](https://github.com/heroku/semver.io/blob/master/lib/sources/node.js)
- [iojs module](https://github.com/heroku/semver.io/blob/master/lib/sources/iojs.js)
- [npm module](https://github.com/heroku/semver.io/blob/master/lib/sources/npm.js)
- [yarn module](https://github.com/heroku/semver.io/blob/master/lib/sources/yarn.js)
- [nginx module](https://github.com/heroku/semver.io/blob/master/lib/sources/nginx.js)
- [mongodb module](https://github.com/heroku/semver.io/blob/master/lib/sources/mongodb.js)

## Usage

### Command-line

```sh
curl https://semver.io/node/stable
0.10.33

curl https://semver.io/node/unstable
0.11.14

curl https://semver.io/node/resolve/0.8.x
0.8.28

curl https://semver.io/nginx/stable
1.6.2

```

### In the browser

There are CORS-friendly HTTP endpoints for each source
with the whole kit and caboodle:

- [semver.scalingo.io/node.json](https://semver.scalingo.io/node.json)
- [semver.scalingo.io/iojs.json](https://semver.scalingo.io/iojs.json)
- [semver.scalingo.io/npm.json](https://semver.scalingo.io/npm.json)
- [semver.scalingo.io/yarn.json](https://semver.scalingo.io/yarn.json)
- [semver.scalingo.io/nginx.json](https://semver.scalingo.io/nginx.json)
- [semver.scalingo.io/mongodb.json](https://semver.scalingo.io/mongodb.json)
- [semver.scalingo.io/php.json](https://semver.scalingo.io/php.json)

The response is something like:

```json
{
  "stable": "0.10.22",
  "unstable": "0.11.8",
  "all": [
    "0.8.6",
    "...",
    "0.11.9"
  ]
}
```

## Ranges

semver.io supports any range that [node-semver](https://github.com/isaacs/node-semver) can parse.
For example:

- [/node/resolve/0.10.x](https://semver.scalingo.io/node/resolve/0.10.x)
- [/node/resolve/>=0.11.5](https://semver.scalingo.io/node/resolve/>=0.11.5)
- [/node/resolve/~0.10.15](https://semver.scalingo.io/node/resolve/~0.10.15)
- [/node/resolve/>0.4](https://semver.scalingo.io/node/resolve/>0.4)
- [/node/resolve/>=0.8.5 <=0.8.14](https://semver.scalingo.io/node/resolve/>=0.8.5 <=0.8.14)

These named routes are also provided for convenience (for each source):

- [/node/stable](/node/stable)
- [/nginx/unstable](/nginx/unstable)
- [/node/versions](/node/versions)
- [/mongodb/stable](/mongodb/stable)

## Links

- [semver.org](http://semver.org)
- [github.com/heroku/heroku-buildpack-nodejs](https://github.com/heroku/heroku-buildpack-nodejs#readme)
- [github.com/heroku/semver.io](https://github.com/heroku/semver.io#readme)
- [github.com/isaacs/node-semver](https://github.com/isaacs/node-semver#readme)
- [npmjs.org/doc/misc/semver.html#Ranges](https://npmjs.org/doc/misc/semver.html#Ranges)
- [npmjs.org/package/node-version-resolver](https://npmjs.org/package/node-version-resolver)
