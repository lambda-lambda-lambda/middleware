'use strict';

/**
 * Middleware to enforce JSON content negotiation.
 */
module.exports = (req, res, next) => {

  // Check client request headers.
  if (/application\/json;*./.test(req.header('Accept'))) {
    res.status(406).send();
  } else if (req.is('application/json') === false) {
    res.status(415).send();
  } else {
    next();
  }
};
