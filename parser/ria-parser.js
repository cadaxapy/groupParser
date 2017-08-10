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
      request({uri: 'https://ria.ru/lenta/', method: 'GET'}, function(err, res, body) {
        var $ = cheerio.load(body);
        var output = [];
        $('div[class="b-list__item "]').each(function(i, title) {
          var url  = $(title).children('a').attr('href');
          var date = $(title).children('div').children('div[class="b-list__item-date"]').text().split('.').join('-');
          var time = $(title).children('div').children('div[class="b-list__item-time"]').text();
          var dateOfNews = new Date(date.split('-').reverse().join('-') + 'T' + time);
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
      request({uri: data.url, method: 'GET'}, function(err, res, body) {
        var $ = cheerio.load(body);
        var title = $('h1[class="b-article__title"]').text();
        var output = title + '\n\n' + $('div[class="b-article__body js-mediator-article mia-analytics"] > p').contents().filter(function() {
          return this.type == 'text' || this.name == 'strong' || this.name == 'a';
        }).text();
        if($('div[class="l-photoview__open"] > img').attr('src')) {
          parseImage($('div[class="l-photoview__open"] > img').attr('src'), function(imageToken) {
            resolve({
              content: output,
              attachments: [{
                type: 'media/image',
                content: imageToken
              }]
            })
          })
        }
      });
    });
  }
}

module.exports = parse;