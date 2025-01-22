'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('assigneds', {
      fields: ['pid'], // Column to add the foreign key
      type: 'foreign key',
      name: 'fk_assigneds_pid', // Constraint name
      references: {
        table: 'projects', // Referenced table name
        field: 'id', // Referenced column name
      },
      onDelete: 'CASCADE', // Delete behavior
      onUpdate: 'CASCADE', // Update behavior
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('assigneds', 'fk_assigneds_pid'); // Remove the foreign key
  },
};
