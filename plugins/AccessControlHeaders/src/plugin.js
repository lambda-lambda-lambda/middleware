'use strict';

/**
 * Middleware to send Access-Control-* headers.
 *
 * Requires:
 *   - AppConfigPlugin
 */
module.exports = (req, res, next) => {
  const config = req.plugin('config');

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Accept,Authorization,Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT');

  // Set CORS restrictions.
  res.setHeader('Access-Control-Allow-Origin',
    (config.development === true) ? '*' : config.origin.siteUrl
  );

  next();
};
