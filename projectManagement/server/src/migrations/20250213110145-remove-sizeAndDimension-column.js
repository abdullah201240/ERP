'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('designMaterialLists', 'sizeAndDimension');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('designMaterialLists', 'sizeAndDimension', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
