# AccessControlHeaders

Middleware to send [Access-Control-*](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers) headers.

## Installation

See package [README](https://github.com/lambda-lambda-lambda/middleware#manual-installation) for instructions.

### Requires

- [AppConfigPlugin](https://github.com/lambda-lambda-lambda/middleware/tree/master/plugins/AppConfigPlugin)

## Configuration

Add the following options to your application `config.json`

```json
// .. appName/src/config.json

{
  "origin": {
    "siteUrl": "http://domain.com",
    "devUrl": "http://localhost:9000"
  },
  "development": false
}
```

## References

- [lambda-lambda-lambda](https://github.com/lambda-lambda-lambda)
