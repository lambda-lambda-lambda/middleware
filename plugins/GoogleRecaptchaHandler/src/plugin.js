'use strict';

const https = require('https');

const {RouterError} = require('@lambda-lambda-lambda/router/src/router/Error');

/**
 * Middleware to validate Google ReCAPTCHA invisible responses.
 *
 * @requires AppConfigPlugin
 * @requires SecretsManagerPlugin // optional alternative
 */
module.exports = async (req, res, next) => {
  let plugin;

  // Load supported plugin.
  try {
    plugin = req.plugin('config');
  } catch (err) {
    // suppress exception.
  }

  if (!plugin) {
    try {
      plugin = req.plugin('secret');
    } catch (err) {
      /* istanbul ignore next */
      throw new RouterError('Missing supported plugin');
    }
  }

  const {google}  = plugin;
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
