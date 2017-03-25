var cheerio = require('cheerio');
var request = require('superagent');
var async = require('async');
var request2 = require('request');
var config = require('../config.js');
var fs = require('fs');
module.exports.parseTopic = function(url, group, callback) {
	return request.get(url).retry(5).end(function(err, page) {
		var $ = cheerio.load(page.text);
		var posted = new Date($('div[class="post_body"] > p > abbr[class="published"]').attr('title'));
		console.log(group.last_parsed_date);
		if(group.last_parsed_date > posted) {
			return callback(null);
		}
		var imageUrls = [];
		var data = {
			attachments: [],
			content: $('div[class="post_body"] > div[itemprop="commentText"]').first().contents().filter(function() {
	return this.type === 'text' || (this.name === 'p' && Object.keys(this.attribs).length === 0);
}).text().trim()
		}
		$('div[class="post_body"] > div > div > ul > li > a').each(function(i, title) {
			imageUrls.push($(title).attr('href'));
		});
		console.log(data);
		console.log(url);
		async.map(imageUrls, function(imageUrl, innerCallback) {			
			parseImage(imageUrl, function(token) {
				var data = {
					type: 'media/image',
					content: token
				}
				return innerCallback(null, data);
			})
		}, function(err, attachments) {
			if(attachments) {
				data.attachments = attachments;
		}
			console.log('Topic successfuly parsed');
		  callback(data);
		})
	})
}

 module.exports.parseForum = function(url, callback) {
	console.log('trying to parse forum');
	request.get(url).retry(5).end(function(err, page) {
		var $ = cheerio.load(page.text);
		var forumUrl = [];		
		$('td[class="col_c_forum"] > h4 > a').each(function(i, title) {
			forumUrl.push($(title).attr('href'));
		})
		console.log('Forum successfuly parsed');
		callback(forumUrl);
	})
 }

module.exports.parseTheme = function(url ,callback) {
	console.log('trying to parse Theme');
	url = url + '&st=&sort_key=start_date&sort_by=Z-A';
	request.get(url).retry(5).end(function(err, page) {
		var $ = cheerio.load(page.text);
		var topicUrl = [];
		$('td[class="col_f_content "]').each(function(i, title) {
			if($(title).children('span[class="ipsBadge ipsBadge_green"]').text().trim() != 'Закреплено') {
				topicUrl.push($(title).children('h4').children('a').attr('href'));
			}
		})
		console.log('Theme successfuly parsed');
		callback(topicUrl);
	})
}


parseImage = function(url, cb) {
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