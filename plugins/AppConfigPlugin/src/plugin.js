'use strict';

/**
 * Middleware to support a file-based app configuration.
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
