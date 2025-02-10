module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('productUnits', 'sisterConcernId', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('productUnits', 'sisterConcernId');
  }
};
