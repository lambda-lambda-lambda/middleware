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

describe('ContentNegotiationJson', function() {
  describe('missing header', function() {
    const stack = new Stack();

    Utils.setFuncName(middleware, 'middleware');

    const route = function(req, res) {
      res.status(200).send();
    };

    Utils.setFuncName(route, 'route:index');

    stack.middleware = [middleware];
    stack.routes     = route;

    // Delete Accept header.
    delete event.Records[0].cf.request.headers['accept'];

    const req = new Request(event.Records[0].cf.request, {});
    const res = new Response({});

    stack.exec(req, res);

    const result = res.data();

    it('should not return headers', function() {
      expect(result.headers).to.be.empty;
    });

    it('should return status', function() {
      expect(result.status).to.equal(415);
    });

    it('should not return body', function() {
      expect(result.body).to.be.undefined;
    });
  });

  describe('invalid header', function() {
    const stack = new Stack();

    Utils.setFuncName(middleware, 'middleware');

    const route = function(req, res) {
      res.status(200).send();
    };

    Utils.setFuncName(route, 'route:index');

    stack.middleware = [middleware];
    stack.routes     = route;

    // Define Accept header.
    event.Records[0].cf.request.headers['accept'] = [{
      key: 'Accept',
      value: 'application/json;text/html'
    }];

    const req = new Request(event.Records[0].cf.request, {});
    const res = new Response({});

    stack.exec(req, res);

    const result = res.data();

    it('should not return headers', function() {
      expect(result.headers).to.be.empty;
    });

    it('should return status', function() {
      expect(result.status).to.equal(406);
    });

    it('should not return body', function() {
      expect(result.body).to.be.undefined;
    });
  });

  describe('valid header', function() {
    const stack = new Stack();

    Utils.setFuncName(middleware, 'middleware');

    const route = function(req, res) {
      res.status(200).send();
    };

    Utils.setFuncName(route, 'route:index');

    stack.middleware = [middleware];
    stack.routes     = route;

    // Define Accept header.
    event.Records[0].cf.request.headers['accept'] = [{
      key: 'Accept',
      value: 'application/json'
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
});
