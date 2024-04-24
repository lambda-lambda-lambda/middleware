'use strict';

/**
 * Middleware to store the app configuration.
 */
module.exports = (config) => {
  return (req, res, next) => {
    if (config) {
      Object.freeze(config);

      req.plugin('config', config);
    } else {
      throw Error('Missing configuration');
    }

    next();
  };
};
