var cheerio = require('cheerio');
var request = require('request');
var utf = require('utf8')
var async = require('async');
var request2 = require('request');
var config = require('../config.js');
var parseImage = require('./parseImage.js').parseImage;
var fs = require('fs');

var parse = {
  parseThemes: function(data) {
    return new Promise(function(resolve, reject) {
      var output = [];
      request({uri: data.group.forum_url + '/archive', method: 'GET'}, function(err, res, body) {
        var $ = cheerio.load(body);
        $('div[class="archive-day-articles"]:nth-child(1) > div[class="archive-article small"]').each(function(i, title) {
          var url = $(title).children('a').attr('href');
          var time = $(title).children('div').text();
          if(time[1] == ':') {
            time = '0' + time;
          }
          var dateOfNews = new Date(url.split('/').slice(1, 4).join('-') + 'T' + time);
          dateOfNews.setHours(dateOfNews.getHours() - 3);
          if(data.group.last_parsed_date < dateOfNews) {
            output.push(url);
          }
        })
        resolve(output);
      })
    })
  },
  parseTopic: function(data) {
    return new Promise(function(resolve, reject) {
      var output = '';
      request({uri: data.url, method: 'GET'}, function(err, res, body) {
        var $ = cheerio.load(body);
        $('article[data-reactid="94"] > div').contents().filter(function() {
          return this.name == 'p' || this.attribs.class == 'article-block text';
        }).each(function(i, e) {
          output += $(e).text().trim() + '\n\n';
        });
        parseImage(data.group.forum_url + $('div[class="article-header-container-inside"] > img[class="img-absolute"]').attr('src'), function(imageToken) {
          var content = {
            content: output,
            attachments: [{
              type: 'media/image',
              content: imageToken 
            }]
          }
          resolve(content);
        })
      })
    })
  }
}

module.exports = parse;