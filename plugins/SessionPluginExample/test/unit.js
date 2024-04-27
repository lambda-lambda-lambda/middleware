'use strict';

const event          = require(`${PACKAGE_ROOT}/event.json`);
const chai           = require('chai');
const chaiAsPromised = require('chai-as-promised');

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

describe('SessionPlugin', function() {
  const stack = new Stack();

  describe('success', function() {
    const settings = {
      cookieName: 'SESSIONID',
      validator: (token) => ({role: 'user', status: 'active', foo: 'bar'})
    };

    const dependency = function(req, res, next) {
      req.plugin('cookies', {[settings.cookieName]: 'abcdefghijklmnopqrstuvwxyz123456'});
      next();
    };

    Utils.setFuncName(dependency, 'middleware');
    Utils.setFuncName(middleware, 'middleware');

    const route = async function(req, res, next) {
      res.status(200).send();
    };

    Utils.setFuncName(route, 'route:index');

    stack.middleware = [dependency, middleware(settings)];
    stack.routes     = route;

    // Define form POST parameters.
    event.Records[0].cf.request.method = 'GET';
    event.Records[0].cf.request.uri    = '/path/to/resource';
    event.Records[0].cf.request.body   = {
      data: Buffer.from('')
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
    const settings = {
      cookieName: '',
      validator: (token) => (true)
    };

    const dependency = function(req, res, next) {
      req.plugin('cookies', {SESSIONID: 'abcdefghijklmnopqrstuvwxyz123456'});
      next();
    };

    Utils.setFuncName(dependency, 'middleware');
    Utils.setFuncName(middleware, 'middleware');

    const route = async function(req, res, next) {
      res.status(200).send();
    };

    Utils.setFuncName(route, 'route:index');

    stack.middleware = [dependency, middleware(settings)];
    stack.routes     = route;

    const req = new Request(event.Records[0].cf.request, {});
    const res = new Response({});

    it('should throw RouterError', function() {
      const result = stack.exec(req, res);

      expect(result).to.be.rejectedWith(RouterError, /Invalid session options/);
    });
  });
});
