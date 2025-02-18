module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('saveMaterials', 'feedbackFile', {
      type: Sequelize.STRING,  // You can use Sequelize.JSON if you want to store multiple URLs
      allowNull: true,         // Optional field
    });

    await queryInterface.addColumn('saveMaterials', 'feedbackText', {
      type: Sequelize.TEXT,    // Use TEXT to store longer feedback text
      allowNull: true,         // Optional field
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('saveMaterials', 'feedbackFile');
    await queryInterface.removeColumn('saveMaterials', 'feedbackText');
  }
};
