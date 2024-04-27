'use strict';

const {RouterError} = require('@lambda-lambda-lambda/router/src/router/Error');

/**
 * Middleware example of validating a session that uses cookies.
 *
 * @requires CookieParserPlugin
 */
module.exports = ({cookieName, validator}) => {
  return async (req, res, next) => {
    if (cookieName && typeof validator === 'function') {
      try {
        const cookies = req.plugin('cookies');
        const token = cookies[cookieName];
        token && req.plugin('session', await validator(token));

      } catch {
        // Continue as "anonymous" user.
      }

    } else {
      throw new RouterError('Invalid session options');
    }
  };
};
