'use strict';

const event = require(`${PLUGIN_ROOT}/test/event.json`);
const chai  = require('chai');

const expect = chai.expect;

// Load modules.
const Common     = require('lambda-lambda-lambda/src/router/Common.js');
const Request    = require('lambda-lambda-lambda/src/router/Request.js');
const Response   = require('lambda-lambda-lambda/src/router/Response.js');
const Stack      = require('lambda-lambda-lambda/src/router/Stack.js');
const middleware = require(`${PLUGIN_ROOT}/src/index.js`);

describe('BasicAuthHandler', function() {
  describe('success', function() {
    const stack = new Stack();

    Common.setFuncName(middleware, 'middleware');

    const route = function(req, res) {
      res.status(200).send();
    };

    Common.setFuncName(route, 'route:index');

    stack.middleware = [middleware];
    stack.routes     = route;

    // Define Authorization header.
    event.Records[0].cf.request.headers['authorization'] = [{
      key: 'Authorization',
      value: 'Basic cHJpdmF0ZTpwYXNzd29yZA=='
    }];

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

  describe('failure', function() {
    const stack = new Stack();

    Common.setFuncName(middleware, 'middleware');

    const route = function(req, res) {
      res.status(200).send();
    };

    Common.setFuncName(route, 'route:index');

    stack.middleware = [middleware];
    stack.routes     = route;

    // Delete Authorization header.
    delete event.Records[0].cf.request.headers['authorization'];

    const req = new Request(event.Records[0].cf.request, {});
    const res = new Response({});

    stack.exec(req, res);

    const result = res.data();

    it('should return headers', function() {
      expect(result.headers).to.have.property('www-authenticate');
    });

    it('should return status', function() {
      expect(result.status).to.equal(401);
    });

    it('should return body', function() {
      expect(result.body).to.equal('Unauthorized');
    });
  });
});