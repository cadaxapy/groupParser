'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('groups', 'user_password', {
      type: Sequelize.STRING
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('groups', 'user_password');
  }
};