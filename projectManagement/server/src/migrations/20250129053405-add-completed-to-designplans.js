'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('designPlans', 'completed', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '0',  // Default value is the string '0'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('designPlans', 'completed');
  }
};
