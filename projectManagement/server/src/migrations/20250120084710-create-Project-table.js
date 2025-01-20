'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('projects', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      projectType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      projectName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      totalArea: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      projectAddress: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      clientName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      clientAddress: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      clientContact: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      clientEmail: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      creatorName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      creatorEmail: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      requirementDetails: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('projects');
  }
};
