'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('workingDrawings', 'operatingExpense', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('workingDrawings', 'vat', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('workingDrawings', 'tax', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('workingDrawings', 'operatingExpense');
    await queryInterface.removeColumn('workingDrawings', 'vat');
    await queryInterface.removeColumn('workingDrawings', 'tax');
  }
};
