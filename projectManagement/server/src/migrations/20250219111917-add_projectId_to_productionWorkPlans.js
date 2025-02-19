module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('productionWorkPlans', 'projectId', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('productionWorkPlans', 'projectId');
  },
};
