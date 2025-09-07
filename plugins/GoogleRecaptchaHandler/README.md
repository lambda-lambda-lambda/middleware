# GoogleRecaptchaHandler

Middleware to validate [Google ReCAPTCHA invisible](https://developers.google.com/recaptcha/docs/invisible) responses.

## Installation

See package [README](https://github.com/lambda-lambda-lambda/middleware#manual-installation) for instructions.

### Requires

- [AppConfigPlugin](https://github.com/lambda-lambda-lambda/middleware/tree/master/plugins/AppConfigPlugin)
- [SecretsManagerPlugin](https://github.com/lambda-lambda-lambda/middleware/tree/master/plugins/AppConfigPlugin) (optional alternative)

## Configuration

Add the following options to your application `config.json`, or as an alternative you can store the values as [Secrets Manager secret](https://github.com/lambda-lambda-lambda/middleware/blob/master/plugins/SecretsManagerPlugin/README.md#secrets-manager-setup).

```json
// .. appName/src/config.json

{
  "google": {
    "reCaptcha": {
      "secretKey": "GOOGLE_API_KEY"
    }
  }
}
```

## HTML example

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <script src="https://www.google.com/recaptcha/api.js" async defer></script>
    <script>
      function onSubmit(token) {
        document.querySelector('form').submit();
      }
    </script>
  </head>
  <body>
    <form method="POST" action="/path/to/resource">
      <button class="g-recaptcha" data-sitekey="GOOGLE_SITE_KEY" data-callback="onSubmit">Submit</button>
    </form>
  </body>
</html>
```

## References

- [reCAPTCHA API Key Signup](http://www.google.com/recaptcha/admin)
- [reCAPTCHA Developers Guide](https://developers.google.com/recaptcha/intro)
- [lambda-lambda-lambda](https://github.com/lambda-lambda-lambda)
