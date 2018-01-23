# Telenor Auth Library

Telenor Auth Library for Node.js. This library is currently only used in our [api-samples](https://github.com/TelenorNorway/api-samples) to simplify the authentication code in the example code.


## Usage

The current supported grant type is Authorization Code Grant. To authenticate with Telenor APIs using *auth-library* you need to create an instance of the module:

```javascript
const Auth = new TelenorAuthLibrary({
  clientId: '',
  clientSecret: '',
  hostname: 'api.telenor.no'
  state: '', // optional - recommended
  scope: '' // optional
});
```


### authorization_code

The Authorization Code Grant type is used to request end user consent to perform actions on the APIs. It is a redirection-based flow, which means that the client must be capable of interacting with the resource owner's user-agent (i.e. a web browser) and capable of receiving incoming requestsion (via redirection) from the authorization server.

1. User requests login from the application. This redirects user to `TelenorAuthLibrary.AuthroizationCode().authorize([ options ])`.
2. User is redirected back to the application callback URL.
3. Pass the callback uri to the `getToken(...)` method to retrieve the token: `TelenorAuthLibrary.AuthorizationCode().getToken(uri)`.

```javascript
const express = require('express');
const TelenorAuthLibrary = require('telenor-auth-library');

const app = express();

const Auth = new TelenorAuthLibrary({ ... });

app.get('/authorize', (req, res) => {
  Auth.AuthorizationCode().authorize()
      .then((location) => res.redirect(location))
      .catch((error) => res.status(401).send('Failed authorizing.'));
});

app.get('/callback', (req, res) => {
  Auth.AuthorizationCode().getToken(req.originalUrl)
      .then((result) => res.redirect(`/?token=${result.access_token}`))
      .catch((error) => res.status(200).send(`Error: ${error.message}`));
});
```
