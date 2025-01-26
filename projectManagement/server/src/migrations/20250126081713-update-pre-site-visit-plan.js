'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove the `projectDetails` column
    await queryInterface.removeColumn('preSiteVisitPlans', 'projectDetails');
    
    // Add `clientName` column
    await queryInterface.addColumn('preSiteVisitPlans', 'clientName', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    // Add `clientNumber` column
    await queryInterface.addColumn('preSiteVisitPlans', 'clientNumber', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Add `projectDetails` column back
    await queryInterface.addColumn('preSiteVisitPlans', 'projectDetails', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    // Remove `clientName` column
    await queryInterface.removeColumn('preSiteVisitPlans', 'clientName');

    // Remove `clientNumber` column
    await queryInterface.removeColumn('preSiteVisitPlans', 'clientNumber');
  }
};
