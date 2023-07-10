'use strict';

/**
 * Middleware to generate Swagger UI viewer.
 *
 * @requires AppConfigPlugin
 */
module.exports = (swaggerJson) => {
  return (req, res, next) => {
    const {development} = req.plugin('config');

    const swaggerUi = req.param('swagger-ui');

    if (development && swaggerJson && swaggerUi) {
      let contentType, contentBody;

      if (swaggerUi === 'json') {
        contentType = 'application/json';
        contentBody = swaggerJson;
      } else {
        contentType = 'text/html';
        contentBody = htmlMarkup(req.cfReqObj.uri);
      }

      res.setHeader('Content-Type', contentType);
      res.status(200).send(contentBody);
    } else {
      next();
    }
  };
};

/**
 * Return Swagger UI HTML markup (dependency free).
 *
 * @param {String} path
 *   URI path.
 *
 * @return {String}
 */
function htmlMarkup(path) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta
    name="description"
    content="SwaggerUI"
  />
  <title>SwaggerUI</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui.css" />
</head>
<body>
<div id="swagger-ui"></div>
<script src="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui-bundle.js" crossorigin></script>
<script>
  window.onload = () => {
    window.ui = SwaggerUIBundle({
      url: '${path}?swagger-ui=json',
      dom_id: '#swagger-ui',
    });
  };
</script>
</body>
</html>
  `;
}
