var request = require('request');
var FB = require('fb');
var async = require('async');
var parseImage = require('./parseImage.js').parseImage;
var fb = new FB.Facebook({
   'appId'     : '114646395863060',
   'appSecret' : 'c3da8dcc0b68acf26b489a9b20006299'
});
fb.setAccessToken('114646395863060|v9eaMPw8TiawjEw837f4UFsAhds');
module.exports.parseContent = function(group, api) {
  return new Promise(function(resolve, reject) {
    fb.api(group.forum_url + '/feed', {fields: ['message', 'full_picture']}/*group.forum_url + '/feed'*/, function (res) {
      if(!res || res.error) {
        console.log(!res ? 'error occurred' : res.error);
        return resolve();
      }
      async.each(res.data, function(post, callback) {
        if(!post.message || (group.last_parsed_date > new Date(post.created_time))) {
          return callback();
        }

        parseImage(post.full_picture, function(imageToken) {
          var data = {
            content: res.data.message.length > 1 ? res.data.message.text : ".",
            attachments: [{
              type: 'media/image',
              content: imageToken
            }]
          }
          api.postContent(group.user_token, data, group.group_id, function(page) {
            callback();
          });
        });       
      });
    });
  })
 }