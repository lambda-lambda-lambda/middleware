'use strict';

const event = require(`${PACKAGE_ROOT}/event.json`);
const chai  = require('chai');

const expect = chai.expect;

// Load modules.
const Request    = require('@lambda-lambda-lambda/router/src/router/Request.js');
const Response   = require('@lambda-lambda-lambda/router/src/router/Response.js');
const Stack      = require('@lambda-lambda-lambda/router/src/router/Stack.js');
const Utils      = require('@lambda-lambda-lambda/router/src/router/Utils.js');
const middleware = require(PLUGIN_ROOT);

describe('GoogleReCaptchaHandler', function() {
  describe('success', function() {
    const stack = new Stack();

    const dependency = function(req, res, next) {
      const config = {
        google: {
          reCaptcha: {
            // https://developers.google.com/recaptcha/docs/faq#id-like-to-run-automated-tests-with-recaptcha.-what-should-i-do
            secretKey: '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe'
          }
        }
      };

      req.plugin('config', config);
      next();
    };

    Utils.setFuncName(dependency, 'middleware');
    Utils.setFuncName(middleware, 'middleware');

    const route = function(req, res) {
      res.status(200).send();
    };

    Utils.setFuncName(route, 'route:index');

    stack.middleware = [dependency, middleware];
    stack.routes     = route;

    // Define form POST parameters.
    event.Records[0].cf.request.method = 'POST';
    event.Records[0].cf.request.uri    = '/path/to/resource';
    event.Records[0].cf.request.body   = {
      data: Buffer.from('g-recaptcha-response=GOOGLE_RESPONSE')
        .toString('base64')
    };

    const req = new Request(event.Records[0].cf.request, {});
    const res = new Response({});

    stack.exec(req, res);

    const result = res.data();

    it('should not return headers', function() {
      expect(result.headers).to.be.empty;
    });

    it('should return status', function() {
      expect(result.status).to.equal(200);
    });

    it('should not return body', function() {
      expect(result.body).to.be.undefined;
    });
  });
});
