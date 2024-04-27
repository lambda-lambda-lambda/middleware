# SessionPluginExample

Middleware example of validating a session that uses cookies.

## Installation

See package [README](https://github.com/lambda-lambda-lambda/middleware#manual-installation) for instructions.

### app.js

```javascript
const sessionPlugin = require(`${APP_ROOT}/middleware/SessionPluginExample`);

router.use(sessionPlugin({
  cookieName: 'SESSIONID',
  validator: (token) => {

    // Check token using conventional method; Return session values.
    const customValidator = (token) => ({role: 'user', status: 'active', foo: 'bar'});
    const sessionData = customValidator(token);

    if (!sessionData) {
      throw Error(`Invalid session: ${token}`);
    }

    return sessionData;
  }
}));
```

## Usage

```javascript
module.exports = (req, res) => {
  const cookie = req.plugin('cookies');
  // SESSIONID=<token>

  const session = req.plugin('session');
  // {role: 'user', status: 'active', foo: 'bar'}
};
```

## References

- [lambda-lambda-lambda](https://github.com/lambda-lambda-lambda)
