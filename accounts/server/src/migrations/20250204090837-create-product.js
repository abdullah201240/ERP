'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('products', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      brand: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      countryOfOrigin: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      sizeAndDimension: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      supplierProductCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ourProductCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      mrpPrice: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      discountPercentage: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      discountAmount: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      sourcePrice: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      unit: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      product_category: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('products');
  },
};
