var db = require('./models');
var async = require('async');
var parser = require('./parser/parser.js');
var control = require('./control');
var config = require('./config.js');
let api = {};
require('./Api/auth')(api, config);
require('./Api/post')(api, config);

db.Group.findAll({
  where:{
    id: [40]
  }
}).then(groups=>{
  require('./sendContent')(groups, api)
});
