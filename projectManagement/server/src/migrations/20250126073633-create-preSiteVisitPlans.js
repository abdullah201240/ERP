'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('preSiteVisitPlans', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      projectName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      projectId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      projectDetails: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ProjectAddress: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      visitDateTime: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('preSiteVisitPlans');
  },
};
