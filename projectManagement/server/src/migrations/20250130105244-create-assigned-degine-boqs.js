'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('assignedDegineBoqs', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      boqId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      serviceId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      serviceName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      serviceDescription: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      totalFees: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      serviceAmount: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      servicePercentage: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('assignedDegineBoqs');
  }
};
