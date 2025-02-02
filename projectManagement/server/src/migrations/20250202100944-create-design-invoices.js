'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('designInvoices', {
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
      boqName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      clientContact: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      clientName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      nowPayAmount: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      projectAddress: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      subject: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      totalFees: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      totalArea: {
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
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('designInvoices');
  }
};
