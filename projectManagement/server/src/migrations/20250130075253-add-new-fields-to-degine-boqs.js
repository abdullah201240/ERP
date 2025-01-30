'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('degine_boqs', 'date', {
      type: Sequelize.STRING,
      allowNull: true,  // Optional field
    });
    
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('degine_boqs', 'date');
  }
};
