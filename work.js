var db = require('./models');
var async = require('async');
var parser = require('./parser/parser.js');
var control = require('./control');
module.exports = function(api) {
  setInterval(function() {
    db.Group.findAll().then(function(groups) {
	console.log('hello');
      async.each(groups, function(group, callback) {
        (new Promise(function(resolve) {
          if((Date.now() - group.get('user_token_last_update') ) / 3600000 > 23) {
            return api.auth(group.get('user_phone'), group.get('user_password'), function(err, res) {
              if(err) {
                throw new Error(err);
              }
              console.log("TOKen UPDATED");
	      console.log(res.body);
              group.set('user_token', res.body.data.token);
              group.set('user_token_last_update', new Date());
              return group.save().then(function(group) {
                resolve(group);
              })
            })
          }
          resolve(group);
        })).then(function(group) {
	console.log('parsing started');
          control[group.parserType](group, api).then(function() {
            group.set('last_parsed_date', new Date());
            group.save(function() {
              callback();
            })
          })
          /*parser.parseTheme(group.forum_url, function(themes) {
            async.each(themes, function(theme, themeCallback) {
              parser.parseTopic(theme, group, function(topic) {
                api.postContent(group.user_token, topic, group.group_id, function() {
                  themeCallback();
                })
              });
            }, function() {
              console.log('SUCCESS');
              group.set('last_parsed_date', new Date());
              group.save(function() {
                callback();
              });
            })
          })*/
        });
      })
    })
  }, 3600000 * 4);//3600000
}
