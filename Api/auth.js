var request = require('superagent');

module.exports = function(api, config) {

  api.auth = function(phone, password, callback) {
    request.post(config.API + '/users/auth')
    .set('Content-Type', 'application/json')
    .send({phone: phone, password: password})
    .end(callback)
  }
}
