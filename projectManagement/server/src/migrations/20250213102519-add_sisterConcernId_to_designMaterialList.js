'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('designMaterialLists', 'sisterConcernId', {
      type: Sequelize.STRING,
      allowNull: true, // Set false if it should be required
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('designMaterialLists', 'sisterConcernId');
  },
};
