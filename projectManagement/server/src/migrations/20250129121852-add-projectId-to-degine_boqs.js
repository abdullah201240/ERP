'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('degine_boqs', 'projectId', {
      type: Sequelize.STRING,
      allowNull: true, // Can be null initially
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('degine_boqs', 'projectId');
  }
};
