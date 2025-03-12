'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('permissions', [
      {
        permission_name: 'upload_working_drawing',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        permission_name: 'materials',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        permission_name: 'review_working_drawing_boq',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      
    
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('permissions', null, {});
  }
};
