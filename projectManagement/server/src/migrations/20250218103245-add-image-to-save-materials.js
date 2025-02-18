'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.addColumn('saveMaterials', 'image', {
            type: Sequelize.STRING,
            allowNull: true, // Optional field
        });
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('saveMaterials', 'image');
    }
};
