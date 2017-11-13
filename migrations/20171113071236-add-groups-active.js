/**
 * Created by ilgizkasymov on 11/13/17.
 */
'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('groups', 'active', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('groups', 'active');
  }
};