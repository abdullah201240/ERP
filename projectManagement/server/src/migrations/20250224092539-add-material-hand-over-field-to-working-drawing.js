'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('workingDrawings', 'materialHandOver', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0, // Default value for materialHandOver
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('workingDrawings', 'materialHandOver');
  }
};
