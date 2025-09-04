# SecretsManagerPlugin

Middleware to support [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html) based app configuration.

## Dependencies

- [@aws-sdk/client-secrets-manager](https://www.npmjs.com/package/@aws-sdk/client-secrets-manager)

## Secrets Manager setup

When [storing a new secret](https://us-east-1.console.aws.amazon.com/secretsmanager/listsecrets?region=us-east-1) select the Secret Type **"Other type of secret"** with Key/value pairs **Plaintext** (JSON text string), for example:

```json
{
  "host"       : "ProdServer-01.databases.example.com",
  "port"       : "8888",
  "username"   : "administrator",
  "password"   : "EXAMPLE-PASSWORD",
  "dbname"     : "MyDatabase",
  "engine"     : "mysql"
}
```

## Installation

See package [README](https://github.com/lambda-lambda-lambda/middleware#manual-installation) for instructions.

### app.js

```javascript
// Using JavaScript object file.
const secretsManagerPlugin = require(`${APP_ROOT}/middleware/SecretsManagerPlugin`);

router.use(secretsManagerPlugin('secret name', 'us-east-1')); // Region is optional (default: us-east-1)
```

## Usage

```javascript
module.exports = (req, res) => {
  const value = req.plugin('secret').host;
  // ProdServer-01.databases.example.com
};
```

## References

- [lambda-lambda-lambda](https://github.com/lambda-lambda-lambda)
- [Securing and Accessing Secrets from Lambda@Edge](https://aws.amazon.com/blogs/networking-and-content-delivery/securing-and-accessing-secrets-from-lambdaedge-using-aws-secrets-manager)
- [GetSecretValue errors](https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html#API_GetSecretValue_Errors)
