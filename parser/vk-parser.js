var request = require('request');
var VK = require('vksdk');
var async = require('async');
var parseImage = require('./parseImage.js');
var vk = new VK({
   'appId'     : 6089855,
   'appSecret' : 'mdu5h8ve5HmWwLYW97SN',
   'language'  : 'ru'
});
vk.setToken('0c45d1190c45d1190c45d119110c193d6600c450c45d119551560110f984b5c7ad6e8e9');
vk.setSecureRequests(true);
var parse = {};

parse.parseContent = function(group, api) {
  return new Promise(function(resolve, reject) {
    var searchParams = {};
    if(group.forum_url.substring(0, 6) == 'public') {
      searchParams.owner_id  = '-' + group.forum_url;

    } else {
      searchParams.domain = group.forum_url;
    }
    vk.request('wall.get', searchParams, function(body) {
      async.map(body.response.items, function(item, callback) {
        if((group.last_parsed_date > new Date(item.date * 1000)) || item.copy_history) {
          return callback();
        }
        async.map(item.attachments, function(attachment, callback2) {
          if(attachment.type != 'photo') {
            return callback2();
          }
          parseImage(attachment.photo.photo_604, function(imageToken) {
            var data = {
              type: 'media/text',
              content: imageToken
            }
            callback2(null, data);
          })
        }, function(err, attachments) {
          var data = {};
          data.content = item.text;
          if(attachments) {
            data.attachments = attachments;
          }
          api.postContent(group.user_token, data, group.group_id, function() {
            callback();
          })
        })
      }, function() {
        console.log('vk parsed');
        resolve();
      })
    })
  })
}

module.exports = parse;