var request = require('superagent');

module.exports = function(api, config) {
	api.postContent = function(token, content, group_id, callback) {
		if(!content) {
			return callback();
		}
		var data = {
			content: content.content,
			comment_enabled: 1
		}
		if(content.attachments) {
			data.attachments = content.attachments;
		}
		request.post(config.API + '/groups/' + group_id + '/post')
			.set('X-Namba-Auth-Token', token)
			.set('Content-Type', 'application/json')
			.send(data)
			.end(function(err, page) {
			console.log(page.body);
			callback(page);
		})
	}
}