'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('designMaterialLists', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      brand: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      brandModel: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      clientContact: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      clientName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      countryOfOrigin: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      discountAmount: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      discountPercentage: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      productId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      itemDescription: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      itemName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      itemNeed: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      itemQuantity: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      mrpPrice: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      productName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ourProductCode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      product_category: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      projectAddress: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      projectId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      projectName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      sizeAndDimension: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      sourcePrice: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      supplierProductCode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      unit: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('designMaterialLists');
  },
};
