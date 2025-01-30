'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('degine_boqs', 'firstPera', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.changeColumn('degine_boqs', 'secondPera', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.changeColumn('degine_boqs', 'feesProposal', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.changeColumn('degine_boqs', 'feesProposalNote1', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.changeColumn('degine_boqs', 'feesProposalNote2', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('degine_boqs', 'firstPera', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('degine_boqs', 'secondPera', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('degine_boqs', 'feesProposal', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('degine_boqs', 'feesProposalNote1', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('degine_boqs', 'feesProposalNote2', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
