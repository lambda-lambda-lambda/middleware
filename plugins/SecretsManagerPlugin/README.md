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

### CloudFormation `template.yaml`

The following [Resources](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-anatomy.html) need to be configured in order to generate IAM execution policies.

```yaml
Resources:
  ..

  LambdaEdgeRole:
    Type: AWS::IAM::Role
    Properties:
      RoleName: !Sub '${AWS::StackName}-LambdaEdgeRole'
      AssumeRolePolicyDocument:
        Version: 2012-10-17
        Statement:
          Effect: Allow
          Principal:
            Service:
              - lambda.amazonaws.com
              - edgelambda.amazonaws.com
              - cloudfront.amazonaws.com
              - secretsmanager.amazonaws.com
          Action: sts:AssumeRole
      ManagedPolicyArns:
        - arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

  SecretsManagerPolicy:
    Type: AWS::IAM::Policy
    Properties:
      PolicyName: !Sub '${AWS::StackName}-SecretsManagerPolicy'
      PolicyDocument:
        Version: 2012-10-17
        Statement:
          Effect: Allow
          Action:
            - secretsmanager:GetSecretValue
          Resource: !Sub 'arn:aws:secretsmanager:${AWS::Region}:${AWS::AccountId}:secret:${AWS::StackName}-<Secret Name>-<String>'
      Roles:
        - !Sub '${AWS::StackName}-LambdaEdgeRole'
```

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
