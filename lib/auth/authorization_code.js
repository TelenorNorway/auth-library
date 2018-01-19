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

const https = require('https');


// Default exports
exports = module.exports = AuthorizationCode;


// AuthorizationCode - constructor
function AuthorizationCode(requester) {
  this.requester = requester;
}


// .authorize(..) is used to request authentication by the user
AuthorizationCode.prototype.authorize = function authorize(client_id) {
  return new Promise((resolve, reject) => {
    this.requester.request(`/oauth/v2/authorize?client_id=${client_id}`)
        .then((data) => resolve(data))
        .catch((error) => reject(new Error(error)));
  });
}

// .requestToken(..) returns the accessToken for the current user
// This accessToken is used to perform action towards the
// grant_type=authroization_code API.
AuthorizationCode.prototype.getToken = function getToken(client_id, client_secret, consumer_code) {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Basic ${new Buffer(client_id + ':' + client_secret).toString('base64')}`
      },
      payload: {
        grant_type: 'authorization_code',
        code: consumer_code
      }
    };

    this.requester.request('/oauth/v2/token', options)
        .then((data) => resolve(data))
        .catch((error) => reject(new Error(error)));
  });
}
