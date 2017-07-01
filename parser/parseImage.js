var request2 = require('request');
module.exports.parseImage = function(url, cb) {
    request2({url: url, encoding: null, timeout: 10000}, function(err, res, page) {
      if(!page) {
        return parseImage(url, cb);
      }
      request2.post({
        url: 'https://files.namba1.co',
        json: true,
        formData: {
          file: {
            value: page,
            options: {
              filename: 'image.jpg'
            }
          }
        }
      }, function(err, res, body) {
        cb(body.file);
      });
    })
}