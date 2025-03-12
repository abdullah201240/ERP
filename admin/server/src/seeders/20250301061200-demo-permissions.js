'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('permissions', [
      {
        permission_name: 'update_project',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        permission_name: 'delete_project',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        permission_name: 'view_projects',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        permission_name: 'pre_project_create',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        permission_name: 'pre_project_details',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        permission_name: 'pre_project_update',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        permission_name: 'pre_project_delete',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        permission_name: 'project_create',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        permission_name: 'project_details',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        permission_name: 'project_update',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        permission_name: 'project_delete',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        permission_name: 'supervision_create',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        permission_name: 'supervision_details',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        permission_name: 'supervision_update',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        permission_name: 'supervision_delete',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        permission_name: 'create_design_plan',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        permission_name: 'design_plan_add_step',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        permission_name: 'design_plan_update',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        permission_name: 'design_plan_delete',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      
      
      // Add more permissions as needed
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('permissions', null, {});
  }
};
