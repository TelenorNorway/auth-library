/*
   Copyright 2018 Telenor Norge

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

const https = require('https')
    , Url = require('url')
    , Querystring = require('querystring');


// Default exports
exports = module.exports = AuthorizationCode;


// AuthorizationCode - constructor
function AuthorizationCode(requester, options) {
  this.requester = requester;
  this.options = options;
}


// .authorize(..) is used to request authentication by the user
AuthorizationCode.prototype.authorize = function authorize(opts) {
  const options = Object.assign({}, this.options, opts);

  const path = '/oauth/v2/authorize?' + Querystring.stringify({
    client_id: options.clientId,
    scope: options.scopes,
    state: options.state
  });

  return new Promise((resolve, reject) => {
    this.requester.get(path)
        .then((result) => resolve(result.location))
        .catch((error) => reject(new Error(error)));
  });
}


// .requestToken(..) returns the accessToken for the current user
// This accessToken is used to perform action on the grant_type=authroization_code APIs
AuthorizationCode.prototype.getToken = function getToken(uri, opts) {
  const options = Object.assign({}, this.options, opts);
  const uriObject = Url.parse(uri);

  if (uriObject.query === undefined || uriObject.query === null || typeof uriObject.query !== 'string') {
      return Promise.reject(new Error(`Unable to parse query: ${uri}`));
  }

  const query = Querystring.parse(uriObject.query);

  if (!query.code) {
    return Promise.reject(new Error(`Unable to retrieve code for uri: ${uri}`));
  }

  if (options.state !== null && options.state !== query.state) {
    return Promise.reject(new Error(`Unable to verify state for uri: ${uri}`));
  }

  const requestOptions = {
    headers: {
      Authorization: `Basic ${new Buffer(this.options.clientId + ':' + this.options.clientSecret).toString('base64')}`
    },
    payload: {
      grant_type: 'authorization_code',
      code: query.code
    }
  };

  if (query.scope) {
    requestOptions.payload.scope = query.scope;
  }

  return new Promise((resolve, reject) => {
    this.requester.post('/oauth/v2/token', requestOptions)
        .then((result) => resolve(result))
        .catch((error) => reject(new Error(error)));
  });
}
