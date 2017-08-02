var parser = require('./parser/parser.js');
var vkParser = require('./parser/vk-parser');
var hightech = require('./parser/hightech-parser');
var ria = require('./parser/ria-parser');
var lady = require('./parser/lady-mail.js');
var vcParser = require('./parser/vc-parser.js');
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
  },
  high_tech: function(group, api) {
    return new Promise(function(resolve, reject) {
      hightech.parseThemes({group: group}).then(function(topics) {
        async.each(topics, function(topic, callback) {
          hightech.parseTopic({group: group, url: group.forum_url + topic}).then(function(content) {
            api.postContent(group.user_token, content, group.group_id, function() {
              callback();
            })
          })
        }, function() {
          console.log('hightech parsed');
          resolve();
        })
      })
    })
  },
  ria_parser: function(group, api) {
    return new Promise(function(resolve, reject) {
      ria.parseThemes({group: group}).then(function(topics) {
        async.each(topics, function(topic, callback) {
          ria.parseTopic({group: group, url: group.forum_url + topic}).then(function(content) {
            api.postContent(group.user_token, content, group.group_id, function() {
              callback();
            })
          })
        }, function() {
          console.log('ria parsed');
          resolve();
        })
      })
    })
  },
  lady_mail: function(group, api) {
    return new Promise(function(resolve, reject) {
      lady.parseThemes({group: group}).then(function(topics) {
        async.each(topics, function(topic, callback) {
          lady.parseTopic({group: group, url: group.forum_url + topic}).then(function(content) {
            api.postContent(group.user_token, content, group.group_id, function() {
              callback();
            })
          })
        }, function() {
          console.log('lady parsed');
          resolve();
        })
      })
    })
  },
  vc_parser: function(group, api) {
    return new Promise(function(resolve, reject) {
      vcParser.parseThemes({group: group}).then(function(topics) {
        async.each(topics, function(topic, callback) {
          vcParser.parseTopic({group: group, url: topic}).then(function(content) {
            api.postContent(group.user_token, content, group.group_id, function() {
              callback();
            })
          })
        }, function() {
          console.log('vc parsed');
          resolve();
        });
      });
    });
  }
};