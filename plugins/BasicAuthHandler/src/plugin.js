'use strict';

/**
 * Middleware to prompt Basic Authentication.
 *
 * Requires:
 *   - AppConfigPlugin
 */
module.exports = (req, res, next) => {
  const {basicAuth} = req.plugin('config');

  const username = basicAuth?.username;
  const password = basicAuth?.password;

  if (!username || !password) {
    /* istanbul ignore next */
    throw new Error('Missing Basic Auth credentials');
  }

  const authStr = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');

  if (req.header('Authorization') !== authStr) {
    res.setHeader('WWW-Authenticate', 'Basic');
    res.status(401).send('Unauthorized');
  } else {
    next();
  }
};
