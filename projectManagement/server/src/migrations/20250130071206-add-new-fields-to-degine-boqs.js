'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('degine_boqs', 'subject', {
      type: Sequelize.STRING,
      allowNull: true,  // Optional field
    });
    await queryInterface.addColumn('degine_boqs', 'firstPera', {
      type: Sequelize.STRING,
      allowNull: true,  // Optional field
    });
    await queryInterface.addColumn('degine_boqs', 'secondPera', {
      type: Sequelize.STRING,
      allowNull: true,  // Optional field
    });
    await queryInterface.addColumn('degine_boqs', 'feesProposal', {
      type: Sequelize.STRING,
      allowNull: true,  // Optional field
    });
    await queryInterface.addColumn('degine_boqs', 'feesProposalNote1', {
      type: Sequelize.STRING,
      allowNull: true,  // Optional field
    });
    await queryInterface.addColumn('degine_boqs', 'feesProposalNote2', {
      type: Sequelize.STRING,
      allowNull: true,  // Optional field
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('degine_boqs', 'subject');
    await queryInterface.removeColumn('degine_boqs', 'firstPera');
    await queryInterface.removeColumn('degine_boqs', 'secondPera');
    await queryInterface.removeColumn('degine_boqs', 'feesProposalNote1');
    await queryInterface.removeColumn('degine_boqs', 'feesProposalNote2');
  }
};
