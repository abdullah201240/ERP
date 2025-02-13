'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('workingDrawings', 'status', {
      type: Sequelize.STRING,
      allowNull: true, // You can set this to false if required
      defaultValue: 'pending', // Default value is 'pending'
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('workingDrawings', 'status');
  }
};
