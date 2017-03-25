var request = require('request');

module.exports = function(api, config) {
	api.postContent = function(token, content, group_id, callback) {
		if(!content) {
			return callback();
		}
		var data = {
			content: content.content,
			attachments: content.attachments,
			comment_enabled: 1
		}
		request.post({
			url: config.API + '/groups/' + group_id + '/post',
			headers: {
				'X-Namba-Auth-Token': token 
			},
			rejectUnauthorized: false,
			data: data,
			json: true
		}, function(err, res, page) {
			console.log(err);
			console.log(page);
			callback(page);
		})
	}
}