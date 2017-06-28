'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('groups', 'parserType', {
      type: Sequelize.STRING,
      allowNull: false
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('groups', 'parserType');
  }
};