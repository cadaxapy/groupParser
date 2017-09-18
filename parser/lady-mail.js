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
      request({uri: 'https://lady.mail.ru/rubric/high-life/', method: 'GET'}, function(err, res, body) {
        var $ = cheerio.load(body);
        $('div[class="newsitem newsitem_height_fixed"]').each(function(i, title) {
          var dateOfNews = new Date($(title).children('div').children('span').attr('datetime'));
          var url = $(title).children('span[class="cell"]').children('a').attr('href');
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
        output = $('span[class="hdr_text"] > span[class="hdr__inner"]').text() + '\n\n';
        $('div[class="article__text article__text_lady js-module js-article_text margin_bottom_20 js-mediator-article"]').contents().filter(function() {
          return (this.name == 'div' && this.attribs.class == 'article__item article__item_alignment_left article__item_html');
        }).each(function(i, e) {
          output += $(e).text().trim() + '\n';
        });
        $('div[class="article__text article__text_lady js-module js-article_text margin_bottom_20 js-mediator-article"] > div[class="article__item article__item_alignment_left article__item_embed article__item_source_instagram"]')
        .each(function(i, title) {
          instagramUrls.push($(title).children('div').children('textarea').children('blockquote').children('div').children('p').children('a').attr('href'));
        })
        async.map(instagramUrls, function(url, callback) {
          request({uri: url, method: 'GET'}, function(err, res, body) {
            var $ = cheerio.load(body);
            parseImage($('meta[property="og:image"]').attr('content'), function(imageToken) {
              var content = {
                type: 'media/image',
                content: imageToken 
              }
              callback(null, content);
            })
          })
        }, function(err, data) {
          console.log({
            content: output,
            attachments: data
          })
          resolve({
            content: output,
            attachments: data
          });
        });
      });
    });
  }
}

module.exports = parse;