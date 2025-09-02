# semver.scalingo.com

semver.scalingo.com is a plaintext and JSON webservice that tracks all available versions of:
- [nginx](/nginx/versions)
- [php](/php/versions)
- [python](/python/versions)
- [ruby](/ruby/versions)

It also supports Scalingo Stacks for `nginx`, `php` and `composer`:
- Nginx: `/nginx-${stack}/versions`
- PHP: `/php-${stack}/versions`
- Composer: `/composer-${stack}/versions`

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

- [semver.scalingo.com/nginx.json](https://semver.scalingo.io/nginx.json)
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

- [/php-scalingo-22/resolve/8.4.x](https://semver.scalingo.com/php-scalingo-22/resolve/8.4.x)
- [/php-scalingo-22/resolve/>=8.4.2](https://semver.scalingo.com/php-scalingo-22/resolve/>=8.4.2)
- [/php-scalingo-22/resolve/~8.4.2](https://semver.scalingo.com/php-scalingo-22/resolve/~8.4.2)
- [/php-scalingo-22/resolve/>=8.2.0 <8.3](https://semver.scalingo.com/php-scalingo-22/resolve/>=8.2.0%20<8.3)

These named routes are also provided for convenience (for each source):

- [/nginx/unstable](https://semver.scalingo.com/nginx/unstable)
- [/php-scalingo-22/versions](https://semver.scalingo.com/php-scalingo-22/versions)

## Links

- [Original repository](https://github.com/heroku/semver.io)
- [Semantic Versioning Specifications](https://semver.org)
- [NPM documentation about Semantic Versioning](https://docs.npmjs.com/about-semantic-versioning)

## Development Environment

### Install project dependencies

```shell
docker compose run --rm web npm install
```

### Run the service

```shell
docker compose up
```
