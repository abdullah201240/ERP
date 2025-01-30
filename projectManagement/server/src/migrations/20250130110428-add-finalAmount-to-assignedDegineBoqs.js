'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('assignedDegineBoqs', 'finalAmount', {
      type: Sequelize.STRING,
      allowNull: true, // This field is optional
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('assignedDegineBoqs', 'finalAmount');
  }
};
