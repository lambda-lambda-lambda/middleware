# AppConfigPlugin

Middleware to store the app configuration.

## Installation

See package [README](https://github.com/lambda-lambda-lambda/middleware#manual-installation) for instructions.

### app.js

```javascript
const config = require('./config.json');

const appConfigPlugin = require('./middleware/AppConfigPlugin');

router.use(appConfigPlugin(config));
```

## Usage

```javascript
module.exports = (req, res) => {
  const value = req.plugin('config').value;

    ..
};
```

## References

- [lambda-lambda-lambda](https://github.com/lambda-lambda-lambda)