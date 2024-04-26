'use strict';

const event          = require(`${PACKAGE_ROOT}/event.json`);
const chai           = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon          = require('sinon');
const https          = require('https');

chai.use(chaiAsPromised);

const expect = chai.expect;

// Load modules.
const {
  RouterError,
  Request,
  Response,
  Stack,
  Utils
} = require('@lambda-lambda-lambda/router/exports');

const middleware = require(PLUGIN_ROOT);

afterEach(() => {
  sinon.restore();
});

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

    const route = async function(req, res, next) {
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

  describe('error', function() {
    const stack = new Stack();

    const dependency = function(req, res, next) {
      const config = {
        google: {
          reCaptcha: {
            secretKey: ''
          }
        }
      };

      req.plugin('config', config);
      next();
    };

    Utils.setFuncName(dependency, 'middleware');
    Utils.setFuncName(middleware, 'middleware');

    const route = async function(req, res, next) {
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

    it('should throw RouterError', function() {
      const result = stack.exec(req, res);

      return expect(result).to.be.rejectedWith(RouterError, /Missing Google API secret key/);
    });
  });
});
