'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('productionWorkPlans', 'status', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "Yet to Start",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('productionWorkPlans', 'status');
  }
};
