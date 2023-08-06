# CookieParserPlugin

Middleware to parse/store incoming [HTTP cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies).

## Dependencies

- [cookie](https://www.npmjs.com/package/cookie)

## Installation

See package [README](https://github.com/lambda-lambda-lambda/middleware#manual-installation) for instructions.

## Usage

```javascript
module.exports = (req, res) => {
  const value = req.plugin('cookies').value;
};
```

## References

- [lambda-lambda-lambda](https://github.com/lambda-lambda-lambda)
