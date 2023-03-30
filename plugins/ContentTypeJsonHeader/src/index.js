'use strict';

/**
 * Middleware to send JSON Content-Type header.
 */
module.exports = (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');

  next();
};
