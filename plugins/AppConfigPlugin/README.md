# AppConfigPlugin

Middleware to store the app configuration.

## Installation

See package [README](https://github.com/lambda-lambda-lambda/middleware#manual-installation) for instructions.

### app.js

```javascript
// Using JavaScript object file.
const config = require(`${APP_ROOT}/config.json`);

// Using node-config (alternative)
const config = require('config');

const appConfigPlugin = require(`${APP_ROOT}/middleware/AppConfigPlugin`);

router.use(appConfigPlugin(config));
```

## Usage

```javascript
module.exports = (req, res) => {

  // Using JavaScript object file.
  const value = req.plugin('config').value;

    ..

  // Using node-config (alternative)
  const value = req.plugin('config').get('value');
};
```

## References

- [lambda-lambda-lambda](https://github.com/lambda-lambda-lambda)
- [node-config](https://www.npmjs.com/package/config)
