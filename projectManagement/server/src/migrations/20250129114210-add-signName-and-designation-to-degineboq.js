'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('degine_boqs', 'signName', {
      type: Sequelize.STRING,
      allowNull: true,  // Set to true, as it can be null initially
    });
    await queryInterface.addColumn('degine_boqs', 'designation', {
      type: Sequelize.STRING,
      allowNull: true,  // Set to true, as it can be null initially
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('degine_boqs', 'signName');
    await queryInterface.removeColumn('degine_boqs', 'designation');
  }
};
