'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('projects', 'sisterConcernId', {
      type: Sequelize.INTEGER,
      allowNull: true, // Optional column
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('projects', 'sisterConcernId');
  }
};
