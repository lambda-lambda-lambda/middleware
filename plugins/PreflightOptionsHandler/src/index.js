
'use strict';

/**
 * Middleware to handle preflight requests.
 */
module.exports = (req, res, next) => {
  if (req.method() === 'OPTIONS') {
    res.status(204).send();
  } else {
    next();
  }
};
