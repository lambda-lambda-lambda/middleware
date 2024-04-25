'use strict';

const https = require('https');

const {RouterError} = require('@lambda-lambda-lambda/router/src/router/Error');

/**
 * Middleware to validate Google ReCAPTCHA invisible responses.
 *
 * @requires AppConfigPlugin
 */
module.exports = async (req, res, next) => {
  const {google} = req.plugin('config');

  const secretKey = google?.reCaptcha?.secretKey;

  if (!secretKey) {
    throw new RouterError('Missing Google API secret key');
  }

  /* istanbul ignore next */
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
      if (hr.statusCode === 200) {
        hr.on('data', buffer => {
          const {success} = JSON.parse(buffer.toString());

          if (success !== true) {

            // Return error response.
            res.status(400).send('Bad Request');
          }
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
};
