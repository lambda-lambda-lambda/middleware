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

describe('SwaggerUIViewer', function() {
  describe('html', function() {
    const stack = new Stack();

    const dependency = function(req, res, next) {
      req.plugin('config', {development: true});
      next();
    };

    Utils.setFuncName(dependency, 'middleware');
    Utils.setFuncName(middleware, 'middleware');

    const route = function(req, res) {
      res.status(200).send();
    };

    Utils.setFuncName(route, 'route:index');

    const swaggerJson = {openapi: '3.0.0'};

    stack.middleware = [dependency, middleware(swaggerJson)];
    stack.routes     = route;

    // Define query string parameter.
    event.Records[0].cf.request.querystring = 'swagger-ui=html';

    const req = new Request(event.Records[0].cf.request, {});
    const res = new Response({});

    stack.exec(req, res);

    const result = res.data();

    it('should not return headers', function() {
      expect(result.headers).to.have.property('content-type');
      expect(result.headers['content-type'][0].value).to.equal('text/html');
    });

    it('should return status', function() {
      expect(result.status).to.equal(200);
    });

    it('should return body', function() {
      expect(result.body).to.to.match(/<title>SwaggerUI<\/title>/);
    });
  });

  describe('json', function() {
    const stack = new Stack();

    const dependency = function(req, res, next) {
      req.plugin('config', {development: true});
      next();
    };

    Utils.setFuncName(dependency, 'middleware');
    Utils.setFuncName(middleware, 'middleware');

    const route = function(req, res) {
      res.status(200).send();
    };

    Utils.setFuncName(route, 'route:index');

    const swaggerJson = {openapi: '3.0.0'};

    stack.middleware = [dependency, middleware(swaggerJson)];
    stack.routes     = route;

    // Define query string parameter.
    event.Records[0].cf.request.querystring = 'swagger-ui=json';

    const req = new Request(event.Records[0].cf.request, {});
    const res = new Response({});

    stack.exec(req, res);

    const result = res.data();

    it('should return headers', function() {
      expect(result.headers).to.have.property('content-type');
      expect(result.headers['content-type'][0].value).to.equal('application/json');
    });

    it('should return status', function() {
      expect(result.status).to.equal(200);
    });

    it('should return body', function() {
      expect(result.body).to.to.match(/openapi|swagger/);
    });
  });

  describe('undefined', function() {
    const stack = new Stack();

    const dependency = function(req, res, next) {
      req.plugin('config', {development: true});
      next();
    };

    Utils.setFuncName(dependency, 'middleware');
    Utils.setFuncName(middleware, 'middleware');

    const route = function(req, res) {
      res.status(200).send();
    };

    Utils.setFuncName(route, 'route:index');

    const swaggerJson = {openapi: '3.0.0'};

    stack.middleware = [dependency, middleware(swaggerJson)];
    stack.routes     = route;

    // Define query string parameter.
    delete event.Records[0].cf.request.querystring;

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
      expect(result.body).to.to.undefined;
    });
  });
});
