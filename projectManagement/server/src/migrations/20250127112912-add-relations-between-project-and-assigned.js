'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if the column already exists
    const tableDescription = await queryInterface.describeTable('assignedProjectSiteVisitPlans');

    if (!tableDescription.projectSiteVisitPlanId) {
      // Add the column if it doesn't exist
      await queryInterface.addColumn('assignedProjectSiteVisitPlans', 'projectSiteVisitPlanId', {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'projectSiteVisitPlans', // Name of the target table
          key: 'id', // Key in the target table
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
    }
  },

  async down(queryInterface, Sequelize) {
    // Remove the column
    await queryInterface.removeColumn('assignedProjectSiteVisitPlans', 'projectSiteVisitPlanId');
  },
};
