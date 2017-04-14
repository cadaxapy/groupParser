var db = require('./models');
var async = require('async');
var parser = require('./parser/parser.js');
module.exports = function(api) {
	setInterval(function() {
		db.Group.findAll().then(function(groups) {
			async.each(groups, function(group, callback) {
				(new Promise(function(resolve) {
					if((Date.now() - group.get('user_token_last_update') ) / 3600000 > 23) {
						return api.auth('996702711814', 'xynd4815162342', function(err, res) {
							if(err) {
								throw new Error(err);
							}
              console.log("TOKen UPDATED");
							group.set('user_token', res.body.data.token);
              group.set('user_token_last_update', new Date());
							return group.save().then(function(group) {
								resolve(group);
							})
						})
					}
					resolve(group);
	 			})).then(function(group) {
					parser.parseTheme(group.forum_url, function(themes) {
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
					})
	 			});
			})
		})
	}, 3600000);
}
