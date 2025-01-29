'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('degine_boqs', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      projectName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      clientName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      clientContact: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      projectAddress: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      totalArea: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      inputPerSftFees: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      totalFees: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      termsCondition: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('degine_boqs');
  },
};
