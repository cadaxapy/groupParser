var db = require('./models');
module.exports = function(api) {
  setInterval(function() {
    db.Group.findAll({
      where: {
        active: true
      }
    }).then(function(groups) {
      require('./sendContent')(groups, api)
    })
  }, 3600000 * 4);//3600000
}
