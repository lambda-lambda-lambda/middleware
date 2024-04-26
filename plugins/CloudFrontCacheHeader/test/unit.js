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

describe('CloudFrontCacheHeader', function() {
  const stack = new Stack();

  Utils.setFuncName(middleware, 'middleware');

  const route = function(req, res) {
    res.status(200).send();
  };

  Utils.setFuncName(route, 'route:index');

  stack.middleware = [middleware];
  stack.routes     = route;

  const req = new Request(event.Records[0].cf.request, {});
  const res = new Response({});

  stack.exec(req, res);

  const result = res.data();

  it('should return headers', function() {
    expect(result.headers).to.have.property('cache-control');
    expect(result.headers['cache-control'][0].value).to.equal('max-age=86400; s-maxage=86400');
  });

  it('should return status', function() {
    expect(result.status).to.equal(200);
  });

  it('should not return body', function() {
    expect(result.body).to.be.undefined;
  });
});
