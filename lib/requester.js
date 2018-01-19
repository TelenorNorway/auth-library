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
    , querystring = require('querystring');


// Default export
exports = module.exports = Requester;


// Requester:constructor
function Requester(hostname) {
  this.hostname = hostname;
}

Requester.prototype.request = function request(path, options = {}) {
  const requestOptions = {
    hostname: this.hostname,
    path: path,
    method: options.method || 'GET'
  };

  if (options.headers) {
    requestOptions.headers = options.headers;
  }

  if (requestOptions.method === 'POST') {
    requestOptions.headers = Object.assign({}, requestOptions.headers, {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    });
  }

  return new Promise(function (resolve, reject) {
    const req = https.request(requestOptions, function (res) {
      let rawData = '';

      res.on('data', (data) => { rawData += data; });

      res.on('end', function () {
        let data;

        try {
          data = JSON.parse(rawData);
        } catch (error) {
          data = {};
        }

        resolve({ headers: res.headers, data: data });
      });
    });

    req.on('error', (error) => reject(error));

    // Senf payload if present
    if (options.payload) {
      req.write(querystring.stringify(options.payload));
    }

    req.end();
  });
}
