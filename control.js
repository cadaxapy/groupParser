var parser = require('./parser/parser.js');
var vkParser = require('./parser/vk-parser');
var async = require('async');

module.exports = {
  diesel: function(group, api) {
    return new Promise(function(resolve, reject) {
      parser.parseTheme(group.forum_url, function(themes) {
        async.each(themes, function(theme, themeCallback) {
          parser.parseTopic(theme, group, function(topic) {
            api.postContent(group.user_token, topic, group.group_id, function() {
              themeCallback();
            })
          });
        }, function() {
          console.log('SUCCESS');
          resolve();
        })
      })
    })
  },
  vk: function(group, api) {
    return vkParser.parseContent(group, api)
  }
};
