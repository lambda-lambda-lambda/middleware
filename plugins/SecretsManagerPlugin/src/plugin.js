'use strict';

const {
  SecretsManagerClient,
  GetSecretValueCommand
} = require('@aws-sdk/client-secrets-manager');

const {RouterError} = require('@lambda-lambda-lambda/router/src/router/Error');

/**
 * Middleware to support AWS Secrets Manager based app configuration.
 */
module.exports = (secretName, region = 'us-east-1') => {
  return async (req, res, next) => {
    if (!secretName) {
      throw new RouterError('Missing AWS Secrets Manager secret name');
    }

    const client = new SecretsManagerClient({region});

    let secretResponse;

    try {
      secretResponse = await client.send(
        new GetSecretValueCommand({
          SecretId: secretName,
          VersionStage: 'AWSCURRENT'
        })
      );
    } catch (err) {
      /* istanbul ignore next */
      throw err;
    }

    // Support Key/Value pairs as Plaintext (e.g. JSON)
    const jsonStr = secretResponse?.SecretString;

    if (jsonStr) {
      const config = JSON.parse(jsonStr);

      Object.freeze(config);

      req.plugin('secret', config);
    } else {
      throw new RouterError('Invalid AWS Secrets Manager response');
    }
  };
};
