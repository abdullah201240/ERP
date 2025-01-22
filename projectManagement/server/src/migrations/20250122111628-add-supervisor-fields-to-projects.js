'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('projects', 'supervisorName', {
      type: Sequelize.STRING,
      allowNull: true, // Optional
    });
    await queryInterface.addColumn('projects', 'supervisorEmail', {
      type: Sequelize.STRING,
      allowNull: true, // Optional
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('projects', 'supervisorName');
    await queryInterface.removeColumn('projects', 'supervisorEmail');
  },
};
