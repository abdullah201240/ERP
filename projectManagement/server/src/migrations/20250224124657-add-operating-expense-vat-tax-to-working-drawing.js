'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('workingDrawings', 'margin', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    
   
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('workingDrawings', 'margin');
    
  }
};
