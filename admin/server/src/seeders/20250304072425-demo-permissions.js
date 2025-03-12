'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('permissions', [
      {
        permission_name: 'service_package',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        permission_name: 'boq',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        permission_name: 'generate_boq',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        permission_name: 'generate_invoice',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        permission_name: 'work_category',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      

    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('permissions', null, {});
  }
};
