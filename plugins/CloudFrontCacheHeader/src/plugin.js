'use strict';

/**
 * Middleware to send CloudFront Cache-Control header.
 */
module.exports = (req, res, next) => {
  if (req.method() === 'GET') {

    // Expire Web browser (max-age) / Cloudfront cache (s-maxage)
    res.setHeader('Cache-Control', 'max-age=86400; s-maxage=86400');
  }

  next();
};
