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

describe('BasicAuthHandler', function() {
  describe('success', function() {
    const stack = new Stack();

    const dependency = function(req, res, next) {
      const config = {
        basicAuth: {
          username: 'private',
          password: 'password'
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

    // Define Authorization header.
    event.Records[0].cf.request.headers['authorization'] = [{
      key: 'Authorization',
      value: `Basic ${Buffer.from('private:password').toString('base64')}`
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

    const dependency = function(req, res, next) {
      const config = {
        basicAuth: {
          username: 'private',
          password: 'password'
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

  describe('error', function() {
    const stack = new Stack();

    const dependency = function(req, res, next) {
      const config = {
        basicAuth: {
          username: '',
          password: ''
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

    const req = new Request(event.Records[0].cf.request, {});
    const res = new Response({});

    const result = () => stack.exec(req, res);

    it ('should throw Error', function() {
      expect(result).to.throw(Error, /Missing Basic Auth credentials/);
    });
  });
});
