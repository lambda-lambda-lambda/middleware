# SwaggerUIViewer

Middleware to generate [Swagger UI](https://swagger.io/tools/swagger-ui) viewer.

## Installation

See package [README](https://github.com/lambda-lambda-lambda/middleware#manual-installation) for instructions.

### Requires

- [AppConfigPlugin](https://github.com/lambda-lambda-lambda/middleware/tree/master/plugins/AppConfigPlugin)

### app.js

```javascript
const swaggerJson = require(`${APP_ROOT}/swagger.json`);

const swaggerUIViewer = require(`${APP_ROOT}/middleware/SwaggerUIViewer`);

router.use(swaggerUIViewer(swaggerJson));
```

## Swagger UI

This can accessed by any routes by appending `?swagger-ui=html` to the URL.

## References

- [lambda-lambda-lambda](https://github.com/lambda-lambda-lambda)
