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

describe('AppConfigPlugin', function() {
  const stack = new Stack();

  Utils.setFuncName(middleware, 'middleware');

  const route = function(req, res) {
    const value = req.plugin('config').foo;

    res.status(200).send(value);
  };

  Utils.setFuncName(route, 'route:index');

  describe('loaded', function() {
    const config = {foo: 'bar'};

    stack.middleware = [middleware(config)];
    stack.routes     = route;

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

    it('should return body', function() {
      expect(result.body).to.equal('bar');
    });
  });

  describe('error', function() {
    const config = null;

    stack.middleware = [middleware(config)];
    stack.routes     = route;

    const req = new Request(event.Records[0].cf.request, {});
    const res = new Response({});

    const result = () => stack.exec(req, res);

    it('should throw Error', function() {
      expect(result).to.throw(Error, /Missing configuration/);
    });
  });
});
