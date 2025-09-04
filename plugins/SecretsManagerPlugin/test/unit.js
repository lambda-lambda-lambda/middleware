'use strict';

const {
  SecretsManagerClient,
  GetSecretValueCommand
} = require('@aws-sdk/client-secrets-manager');

const {mockClient} = require('aws-sdk-client-mock');

const smClient = mockClient(SecretsManagerClient);

const event          = require(`${PACKAGE_ROOT}/event.json`);
const chai           = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const expect = chai.expect;

// Load modules.
const {
  Request,
  Response,
  Stack,
  Utils
} = require('@lambda-lambda-lambda/router/exports');

const {RouterError} = require('@lambda-lambda-lambda/router/src/router/Error');

const middleware = require(PLUGIN_ROOT);

afterEach(() => {
  smClient.reset();
});

describe('SecretsManagerPlugin', function() {
  const stack = new Stack();

  Utils.setFuncName(middleware, 'middleware');

  const route = async function(req, res) {
    const value = req.plugin('secret').foo;

    res.status(200).send(value);
  };

  Utils.setFuncName(route, 'route:index');

  describe('loaded', function() {
    const secretName = 'secret name';

    stack.middleware = [middleware(secretName)];
    stack.routes     = route;

    const req = new Request(event.Records[0].cf.request, {});
    const res = new Response({});

    smClient.on(GetSecretValueCommand).resolves({SecretString: '{"foo": "bar"}'});

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
    describe('missing secret name', function() {
      it('should throw RouterError', function() {
        const secretName = null;

        stack.middleware = [middleware(secretName)];
        stack.routes     = route;

        const req = new Request(event.Records[0].cf.request, {});
        const res = new Response({});

        const result = stack.exec(req, res);

        expect(result).to.be.rejectedWith(RouterError, /Missing AWS Secrets Manager secret name/);
      });
    });

    describe('invalid response', function() {
      it('should throw RouterError', function() {
        const secretName = 'secret name';

        stack.middleware = [middleware(secretName)];
        stack.routes     = route;

        const req = new Request(event.Records[0].cf.request, {});
        const res = new Response({});

        smClient.on(GetSecretValueCommand).resolves({SecretString: ''});

        const result = stack.exec(req, res);

        expect(result).to.be.rejectedWith(RouterError, /Invalid AWS Secrets Manager response/);
      });
    });
  });
});
