'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('companies', 'numberOfSister', {
      type: Sequelize.INTEGER,
      allowNull: false, // Adjust this if you want it to be nullable
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('companies', 'numberOfSister');
  }
};
