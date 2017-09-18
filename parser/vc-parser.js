var cheerio = require('cheerio');
var request = require('request');
var utf = require('utf8')
var async = require('async');
var config = require('../config.js');
var parseImage = require('./parseImage.js').parseImage;
var fs = require('fs');

var parse = {
  parseThemes: function(data) {
    return new Promise(function(resolve, reject) {
      var output = [];
      request({uri: 'https://vc.ru/', method: 'GET'}, function(err, res, body) {
        var $ = cheerio.load(body);
        $('div[class="js-feed-loadHere"] > div').each(function(i, title) {
          var $time = $(title).children('div[class="b-feed-item__header"]').children('span[class="b-feed-item__time"]');

          var dateOfNews = new Date($time.children('a').children('time').attr('data-moment-timestamp') * 1000);
          var url = $time.children('a').attr('href');
          if(data.group.last_parsed_date < dateOfNews) {
            output.push(url);
          }
        })
        resolve(output.slice(0, config.POST_PER_INTERVAL));
      })
    })
  },
  parseTopic: function(data) {
    return new Promise(function(resolve, reject) {
      var output = '';
      request({uri: data.url, method: 'GET'}, function(err, res, body) {
        var instagramUrls = [];
        var $ = cheerio.load(body);
        output = $('h1[itemprop="headline"]').text() + '\n\n';
        $('div[class="b-main-article__text"] > p').each(function(i, title) {
          if($(title).text().length != 0) {
            output += $(title).text() + '\n';
          }
        });
        var urls = [];
        $('div[class="b-main-article__text"] > figure').each(function(i, title) {
          var imageUrl = $(title).children('div').children('div').children('div').children('a').attr('href');
          if(imageUrl) {
            urls.push(imageUrl);
          }
        })
        async.map(urls, function(url, callback) {
          parseImage(url, function(imageToken) {
            var content = {
              type: 'media/image',
              content: imageToken
            }
            callback(null, content);
          })
        }, function(err, data) {
          console.log({
            content: output,
            attachments: data
          })
          resolve({
            content: output,
            attachments: data
          })
        });
      });
    });
  }
}
module.exports = parse;