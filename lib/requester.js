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
    , Querystring = require('querystring');


// Default export
exports = module.exports = Requester;


// Requester:constructor
function Requester(options) {
  this.hostname = options.hostname;
}


// Generic request method
Requester.prototype._request = function (options = {}) {
  const requestOptions = Object.assign({}, options, { hostname: this.hostname });

  return new Promise((resolve, reject) => {
    const req = https.request(requestOptions, (res) => {
      let error;
      let rawData = '';

      if (res.statusCode < 200 || res.statusCode >= 400) {
        error = new Error(`Error requestiont resource.\nStatus code: ${res.statusCode}`);
        error.code = 'ESTATUS';
        error.body = res.body;

        reject(error);
      }

      res.on('data', (chunk) => { rawData += chunk; });

      res.on('end', () => {
        try {
          const data = JSON.parse(rawData);
          resolve(data);
        } catch (error) {
          resolve(res.headers);
          console.log('Could not parse data')
        }
      });
    });

    req.on('error', (error) => reject(error));

    if (options.payload) {
      req.write(Querystring.stringify(options.payload));
    }

    req.end();
  });
};


// GET method
Requester.prototype.get = function (path, options = {}) {
  const requestOptions = Object.assign({ headers: { Accept: 'application/json' }}, options, {
    method: 'GET',
    path: path
  });

  return this._request(requestOptions);
};


// POST method
Requester.prototype.post = function (path, options = {}) {
  const requestOptions = Object.assign({}, options, {
    method: 'POST',
    path: path
  });

  requestOptions.headers = Object.assign({}, requestOptions.headers, {
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded'
  });

  return this._request(requestOptions);
};
