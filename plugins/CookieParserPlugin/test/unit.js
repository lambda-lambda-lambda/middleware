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

describe('CookieParserPlugin', function() {
  describe('exists', function() {
    const stack = new Stack();

    Utils.setFuncName(middleware, 'middleware');

    const route = function(req, res) {
      const data = req.plugin('cookies');

      res.status(200).send(data);
    };

    Utils.setFuncName(route, 'route:index');

    stack.middleware = [middleware];
    stack.routes     = route;

    // Define Cookie header.
    event.Records[0].cf.request.headers['cookie'] = [{
      key: 'Cookie',
      value: 'foo=bar; biz=baz'
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

    it('should return body', function() {
      expect(result.body).to.equal('{"foo":"bar","biz":"baz"}');
    });
  });

  describe('undefined', function() {
    const stack = new Stack();

    Utils.setFuncName(middleware, 'middleware');

    const route = function(req, res) {
      const data = req.plugin('cookies');

      res.status(200).send(data);
    };

    Utils.setFuncName(route, 'route:index');

    stack.middleware = [middleware];
    stack.routes     = route;

    delete event.Records[0].cf.request.headers.cookie;

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
      expect(result.body).to.equal('{}');
    });
  });
});
