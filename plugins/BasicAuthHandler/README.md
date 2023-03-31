# BasicAuthHandler

Middleware to prompt [Basic Authentication](https://en.wikipedia.org/wiki/Basic_access_authentication).

## Installation

See package [README](https://github.com/lambda-lambda-lambda/middleware#manual-installation) for instructions.

### Requires

- [AppConfigPlugin](https://github.com/lambda-lambda-lambda/middleware/tree/master/plugins/AppConfigPlugin)

## Configuration

Add the following options to your application `config.json`

```json
// .. appName/src/config.json

{
  "basicAuth": {
    "username": "private",
    "password": "password"
  }
}
```

## References

- [lambda-lambda-lambda](https://github.com/lambda-lambda-lambda)
