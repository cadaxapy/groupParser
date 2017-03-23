'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('groups', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      forum_url: {
        type: Sequelize.STRING,
        allowNull: false
      },
      group_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      user_token: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      user_token_last_update: {
      type: Sequelize.DATE
    },
    last_parsed_date: {
      type: Sequelize.DATE
    },
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('groups');
  }
};