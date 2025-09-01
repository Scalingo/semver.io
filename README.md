# semver.scalingo.com

semver.scalingo.com is a plaintext and JSON webservice that tracks all available versions of:
- [iojs](/iojs/versions)
- [mongodb](/mongodb/versions)
- [nginx](/nginx/versions)
- [node.js](/node/versions)
- [npm](/npm/versions)
- [php](/php/versions)
- [python](/python/versions)
- [redis](/redis/versions)
- [ruby](/ruby/versions)
- [yarn](/yarn/versions)

It also supports Scalingo Stacks for `nginx`, `php` and `composer`:
- [nginx-scalingo-18](/nginx-scalingo-18/versions)
- [nginx-scalingo-20](/nginx-scalingo-20/versions)
- [php-scalingo-18](/php-scalingo-18/versions)
- [php-scalingo-20](/php-scalingo-20/versions)
- [composer-scalingo-18](/composer-scalingo-18/versions)
- [composer-scalingo-20](/composer-scalingo-20/versions)

It uses that version info to resolve
[semver range queries](https://docs.npmjs.com/about-semantic-versioning).

This project if a fork of [github.com/heroku/semver.io](https://github.com/heroku/semver.io).

Scalingo Semver uses a simple and short module system to pull version data from
a variety of sources. Pull requests are welcome!

## Usage

### Command-line

```shell
curl https://semver.scalingo.com/node/stable
0.10.33

curl https://semver.scalingo.com/node/unstable
0.11.14

curl https://semver.scalingo.com/node/resolve/0.8.x
0.8.28

curl https://semver.scalingo.com/nginx/stable
1.6.2
```

### In the browser

There are CORS-friendly HTTP endpoints for each source
with the whole kit and caboodle:

- [semver.scalingo.com/node.json](https://semver.scalingo.io/node.json)
- [semver.scalingo.com/iojs.json](https://semver.scalingo.io/iojs.json)
- [semver.scalingo.com/npm.json](https://semver.scalingo.io/npm.json)
- [semver.scalingo.com/yarn.json](https://semver.scalingo.io/yarn.json)
- [semver.scalingo.com/nginx.json](https://semver.scalingo.io/nginx.json)
- [semver.scalingo.com/mongodb.json](https://semver.scalingo.io/mongodb.json)
- [semver.scalingo.com/php.json](https://semver.scalingo.io/php.json)

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

semver.scalingo.com supports any range that [node-semver](https://github.com/npm/node-semver) can parse.

For example:

- [/node/resolve/0.10.x](https://semver.scalingo.com/node/resolve/0.10.x)
- [/node/resolve/>=0.11.5](https://semver.scalingo.com/node/resolve/>=0.11.5)
- [/node/resolve/~0.10.15](https://semver.scalingo.com/node/resolve/~0.10.15)
- [/node/resolve/>0.4](https://semver.scalingo.com/node/resolve/>0.4)
- [/node/resolve/>=0.8.5 <=0.8.14](https://semver.scalingo.com/node/resolve/>=0.8.5%20<=0.8.14)

These named routes are also provided for convenience (for each source):

- [/node/stable](/node/stable)
- [/nginx/unstable](/nginx/unstable)
- [/node/versions](/node/versions)
- [/mongodb/stable](/mongodb/stable)

## Links

- [Original repository](https://github.com/heroku/semver.io)
- [Semantic Versioning Specifications](https://semver.org)
- [NPM documentation about Semantic Versioning](https://docs.npmjs.com/about-semantic-versioning)

## Development Environment

### Install project dependencies

```shell
docker compose run --rm web yarn install
```

### Run the service

```shell
docker compose up
```
