# L³ middleware

Collection of plugins for use in your [L³](https://github.com/lambda-lambda-lambda) application.

## Supported plugins

| Name                        | Description                               |
|-----------------------------|-------------------------------------------|
| [AccessControlHeaders](https://github.com/lambda-lambda-lambda/middleware/tree/master/plugins/AccessControlHeaders) | Middleware to send `Access-Control-*` headers. |
| [AppConfigPlugin](https://github.com/lambda-lambda-lambda/middleware/tree/master/plugins/AppConfigPlugin) | Middleware to store the app configuration. |
| [BasicAuthHandler](https://github.com/lambda-lambda-lambda/middleware/tree/master/plugins/BasicAuthHandler) | Middleware to prompt [Basic Authentication](https://en.wikipedia.org/wiki/Basic_access_authentication). |
| [CloudFrontCacheHeader](https://github.com/lambda-lambda-lambda/middleware/tree/master/plugins/CloudFrontCacheHeader) | Middleware to send CloudFront `Cache-Control` header. |
| [CookieParserPlugin](https://github.com/lambda-lambda-lambda/middleware/tree/master/plugins/CookieParserPlugin) | Middleware to parse/store incoming [HTTP cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies). |
| [ContentNegotiationJson](https://github.com/lambda-lambda-lambda/middleware/tree/master/plugins/ContentNegotiationJson) | Middleware to enforce JSON [content negotiation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept). |
| [ContentTypeJsonHeader](https://github.com/lambda-lambda-lambda/middleware/tree/master/plugins/ContentTypeJsonHeader) | Middleware to send JSON `Content-Type` header. |
| [GoogleRecaptchaHandler](https://github.com/lambda-lambda-lambda/middleware/tree/master/plugins/GoogleRecaptchaHandler) | Middleware to validate [Google ReCAPTCHA invisible](https://developers.google.com/recaptcha/docs/invisible) responses. |
| [PreflightOptionsHandler](https://github.com/lambda-lambda-lambda/middleware/tree/master/plugins/PreflightOptionsHandler) | Middleware to handle [preflight requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/OPTIONS). |
| [SessionPluginExample](https://github.com/lambda-lambda-lambda/middleware/tree/master/plugins/SessionPluginExample) | Middleware example of validating a session that uses cookies. |
| [SwaggerUIViewer](https://github.com/lambda-lambda-lambda/middleware/tree/master/plugins/SwaggerUIViewer) | Middleware to generate [Swagger UI](https://swagger.io/tools/swagger-ui) viewer. |

## Installation

### Install using the L³ CLI

    Usage: lambda-lambda-lambda install [options] <PackageName>

    Arguments:
      PackageName           Package name (Example: BasicAuthHandler)

    Options:
    -h, --help              display help for command

### Manual installation

Copy the [package](https://github.com/lambda-lambda-lambda/middleware) to your application `/middleware` and include accordingly.

## Usage

### Globally scoped

```javascript
// .. appName/src/app.js

'use strict';

const Router = require('@lambda-lambda-lambda/router');

// Load middleware.
const plugin1 = require(`${APP_ROOT}/middleware/PluginName1`);
const plugin2 = require(`${APP_ROOT}/middleware/PluginName2`);
const plugin3 = require(`${APP_ROOT}/middleware/PluginName3`);

/**
 * @see AWS::Serverless::Function
 */
exports.handler = (event, context, callback) => {
  const {request, response} = event.Records[0].cf;

  const router = new Router(request, response);

  // Executed in order (all routes) /api/*
  router.use(plugin1);
  router.use(plugin2);
  router.use(plugin3);

    // .. Router Methods
};
```

### Locally scoped

```javascript
// .. appName/src/routes/foo.js

'use strict';

// Load middleware.
const plugin1 = require(`${APP_ROOT}/middleware/PluginName1`);
const plugin2 = require(`${APP_ROOT}/middleware/PluginName2`);
const plugin3 = require(`${APP_ROOT}/middleware/PluginName3`);

/**
 * @export {Object}
 */
module.exports = {

  // Executed in order (route only) /api/foo
  middleware: [plugin1, plugin2, plugin3],

    // .. Router Methods
};
```

## Developers

### CLI options

From the plugin directory:

    $ cd plugins/<pluginName>

Run [ESLint](https://eslint.org/) on project sources:

    $ npm run lint

Run [Mocha](https://mochajs.org) integration tests:

    $ npm run test

## Contributions

If you fix a bug, or have a code you want to contribute, please send a pull-request with your changes. (Note: Before committing your code please ensure that you are following the [Node.js style guide](https://github.com/felixge/node-style-guide))

## Versioning

This package is maintained under the [Semantic Versioning](https://semver.org) guidelines.

## License and Warranty

This package is distributed in the hope that it will be useful, but without any warranty; without even the implied warranty of merchantability or fitness for a particular purpose.

_lambda-lambda-lambda/middleware_ is provided under the terms of the [MIT license](http://www.opensource.org/licenses/mit-license.php)

## Author

[Marc S. Brooks](https://github.com/nuxy)
