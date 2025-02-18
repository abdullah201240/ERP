'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('saveMaterials', 'status', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'pending',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('saveMaterials', 'status');
  }
};
