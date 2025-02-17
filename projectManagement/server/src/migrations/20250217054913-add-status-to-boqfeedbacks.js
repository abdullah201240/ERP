'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('boqfeedbacks', 'status', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'pending',
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('boqfeedbacks', 'status');
  },
};
