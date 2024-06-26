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

describe('AccessControlHeaders', function() {
  describe('allow-origin (siteUrl)', function() {
    const stack = new Stack();

    const dependency = function(req, res, next) {
      const config = {
        origin: {
          siteUrl: 'http://domain.com'
        },
        development: false
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

    stack.exec(req, res);

    const result = res.data();

    it('should return headers', function() {
      expect(result.headers).to.have.property('access-control-allow-credentials');
      expect(result.headers['access-control-allow-credentials'][0].value).to.equal('true');
      expect(result.headers).to.have.property('access-control-allow-headers');
      expect(result.headers['access-control-allow-headers'][0].value).to.equal('Accept,Authorization,Content-Type');
      expect(result.headers).to.have.property('access-control-allow-methods');
      expect(result.headers['access-control-allow-methods'][0].value).to.equal('DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT');
      expect(result.headers).to.have.property('access-control-allow-origin');
      expect(result.headers['access-control-allow-origin'][0].value).to.equal('http://domain.com');
    });

    it('should return status', function() {
      expect(result.status).to.equal(200);
    });

    it('should not return body', function() {
      expect(result.body).to.be.undefined;
    });
  });

  describe('allow-origin (devUrl)', function() {
    const stack = new Stack();

    const dependency = function(req, res, next) {
      const config = {
        origin: {
          siteUrl: 'http://domain.com',
          devUrl: 'http://localhost:9000'
        },
        development: true
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

    stack.exec(req, res);

    const result = res.data();

    it('should return headers', function() {
      expect(result.headers).to.have.property('access-control-allow-credentials');
      expect(result.headers['access-control-allow-credentials'][0].value).to.equal('true');
      expect(result.headers).to.have.property('access-control-allow-headers');
      expect(result.headers['access-control-allow-headers'][0].value).to.equal('Accept,Authorization,Content-Type');
      expect(result.headers).to.have.property('access-control-allow-methods');
      expect(result.headers['access-control-allow-methods'][0].value).to.equal('DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT');
      expect(result.headers).to.have.property('access-control-allow-origin');
      expect(result.headers['access-control-allow-origin'][0].value).to.equal('http://localhost:9000');
    });

    it('should return status', function() {
      expect(result.status).to.equal(200);
    });

    it('should not return body', function() {
      expect(result.body).to.be.undefined;
    });
  });

  describe('allow-origin (*)', function() {
    const stack = new Stack();

    const dependency = function(req, res, next) {
      const config = {
        origin: {
          siteUrl: 'http://domain.com'
        },
        development: true
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

    stack.exec(req, res);

    const result = res.data();

    it('should return headers', function() {
      expect(result.headers).to.have.property('access-control-allow-credentials');
      expect(result.headers['access-control-allow-credentials'][0].value).to.equal('true');
      expect(result.headers).to.have.property('access-control-allow-headers');
      expect(result.headers['access-control-allow-headers'][0].value).to.equal('Accept,Authorization,Content-Type');
      expect(result.headers).to.have.property('access-control-allow-methods');
      expect(result.headers['access-control-allow-methods'][0].value).to.equal('DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT');
      expect(result.headers).to.have.property('access-control-allow-origin');
      expect(result.headers['access-control-allow-origin'][0].value).to.equal('*');
    });

    it('should return status', function() {
      expect(result.status).to.equal(200);
    });

    it('should not return body', function() {
      expect(result.body).to.be.undefined;
    });
  });
});
