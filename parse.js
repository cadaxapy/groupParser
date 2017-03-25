var request=require("superagent");
var cheerio=require("cheerio");

	request.get("http://diesel.elcat.kg/index.php?s=85c143a3db0918adc89213efb4ec3a63&showtopic=291799497").end(function(err, page) {
		console.log("asd");
		var $ = cheerio.load(page.text);
		var imageUrls = [];
		console.log($('div[class="post_body"] > div[itemprop="commentText"]').first().contents().filter(function() {
    return this.type === 'text' || (this.name === 'p' && Object.keys(this.attribs).length === 0);
}).text().trim());
		var data = {
			attachments: [],
			content: ''
		}
		console.log(data);
		$('div[class="post_body"] > div > div > ul > li > a').each(function(i, title) {
			imageUrls.push($(title).attr('href'));
		});
		console.log($('div[class="post_body"] > p > abbr[class="published"]').attr('title'));
	})