# SwaggerUIViewer

Middleware to generate [Swagger UI](https://swagger.io/tools/swagger-ui) viewer.

## Installation

See package [README](https://github.com/lambda-lambda-lambda/middleware#manual-installation) for instructions.

### Requires

- AppConfigPlugin

### app.js

```javascript
const swaggerJson = require('../swagger.json');

const swaggerUIViewer = require('./middleware/SwaggerUIViewer');

router.use(swaggerUIViewer(swaggerJson));
```

## Swagger UI

This can accessed by any routes by appending `?swagger-ui` to the URL.

## References

- [lambda-lambda-lambda](https://github.com/lambda-lambda-lambda)
