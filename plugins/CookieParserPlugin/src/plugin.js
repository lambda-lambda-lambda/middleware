'use strict';

const cookie = require('cookie');

/**
 * Middleware to parse/store incoming HTTP cookies.
 */
module.exports = (req, res, next) => {
  const cookieValue = req.header('Cookie');

  if (cookieValue) {
    req.plugin('cookies', cookie.parse(cookieValue));
  } else {
    req.plugin('cookies', {});
  }

  next();
};
