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

const AuthorizationCode = require('./auth/authorization_code')
    , Requester = require('./requester');


// Default export
exports = module.exports = TelenorAuthLibrary;


// TelenorAuthlibrary - constructor
function TelenorAuthLibrary(hostname) {
  this.hostname = hostname;
  this.requester = new Requester(hostname);
}

TelenorAuthLibrary.prototype.AuthorizationCode = function () {
  return new AuthorizationCode(this.requester);
}
