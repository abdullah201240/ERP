'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('projects', 'startDate', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('projects', 'endDate', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('projects', 'startDate');
    await queryInterface.removeColumn('projects', 'endDate');
  }
};
