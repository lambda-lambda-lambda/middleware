'use strict';

const event = require(`${PACKAGE_ROOT}/event.json`);
const chai  = require('chai');

const expect = chai.expect;

// Load modules.
const {
  Request,
  Response,
  Stack,
  Utils
} = require('@lambda-lambda-lambda/router/exports');

const middleware = require(PLUGIN_ROOT);

describe('PreflightOptionsHandler', function() {
  describe('OPTIONS request', function() {
    const stack = new Stack();

    Utils.setFuncName(middleware, 'middleware');

    const route = function(req, res) {
      res.status(200).send();
    };

    Utils.setFuncName(route, 'route:index');

    stack.middleware = [middleware];
    stack.routes     = route;

    // Define request method.
    event.Records[0].cf.request.method = 'OPTIONS';

    const req = new Request(event.Records[0].cf.request, {});
    const res = new Response({});

    stack.exec(req, res);

    const result = res.data();

    it('should not return headers', function() {
      expect(result.headers).to.be.empty;
    });

    it('should return status', function() {
      expect(result.status).to.equal(204);
    });

    it('should not return body', function() {
      expect(result.body).to.be.undefined;
    });
  });

  describe('GET request', function() {
    const stack = new Stack();

    Utils.setFuncName(middleware, 'middleware');

    const route = function(req, res) {
      res.status(200).send();
    };

    Utils.setFuncName(route, 'route:index');

    stack.middleware = [middleware];
    stack.routes     = route;

    // Define request method.
    event.Records[0].cf.request.method = 'GET';

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
