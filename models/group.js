"use strict";

module.exports = function(sequelize, DataTypes) {
  var Group = sequelize.define("Group", {
    forum_url: DataTypes.STRING,
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_token: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    user_token_last_update: {
      type: DataTypes.DATE
    },
    last_parsed_date: {
      type: DataTypes.DATE
    },
    parserType : {
      type: DataTypes.STRING,
      allowNull: false
    },
    user_phone: DataTypes.STRING,
    user_password: DataTypes.STRING,
  }, {
    hooks: { 
      afterUpdate: function(group) {
        if(group.changed('user_token')) {
          group.user_token_last_update = new Date();
        }
      }
    },
    underscored: true,
    underscoredAll: true,
    timestamps: false
  });

  return Group;
};