'use strict';

const https = require('https');

/**
 * Middleware to validate Google ReCAPTCHA invisible responses.
 *
 * @requires AppConfigPlugin
 */
module.exports = async (req, res, next) => {
  return new Promise(function(resolve) {
    const {google} = req.plugin('config');

    const secretKey = google?.reCaptcha?.secretKey;

    if (!secretKey) {
      /* istanbul ignore next */
      throw new Error('Missing Google API secret key');
    }

    if (req.method() === 'POST') {
      const captchaResponse = req.param('g-recaptcha-response');

      const options = {
        hostname: 'www.google.com',
        port: 443,
        path: '/recaptcha/api/siteverify',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };

      const httpRequest = https.request(options, hr => {

        /* istanbul ignore next */
        if (hr.statusCode === 200) {
          hr.on('data', buffer => {
            const {success} = JSON.parse(buffer.toString());

            if (success !== true) {

              // Return error response.
              res.status(400).send('Bad Request');
            }

            resolve();
          });
        } else {
          console.warn(`Google API error: ${hr.statusMessage}`);

          // Return error response.
          res.status(500).send('Internal Server Error');
        }
      });

      httpRequest.write(`secret=${secretKey}&response=${captchaResponse}`);
      httpRequest.end();
    }
  });
};
