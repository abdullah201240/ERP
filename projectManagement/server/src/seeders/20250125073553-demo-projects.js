'use strict';

const { QueryInterface } = require('sequelize'); // QueryInterface is provided by Sequelize in migrations
const generateRandomString = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const generateRandomDate = (startYear, endYear) => {
  const start = new Date(startYear, 0, 1);
  const end = new Date(endYear, 11, 31);
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const up = async (queryInterface) => {
  const projects = [];
  for (let i = 1; i <= 1000; i++) {
    projects.push({
      projectType: 'Premium',
      projectName: `Project ${generateRandomString(5)}`,
      totalArea: `${Math.floor(Math.random() * 5000)} m²`,
      projectAddress: `Address ${generateRandomString(10)}`,
      clientName: `Client ${generateRandomString(3)}`,
      clientAddress: `Client Address ${generateRandomString(8)}`,
      clientContact: `+1${Math.floor(Math.random() * 1000000000)}`,
      clientEmail: `client${i}@example.com`,
      creatorName: `Creator ${generateRandomString(4)}`,
      creatorEmail: `creator${i}@example.com`,
      requirementDetails: `Requirement details for Project ${i}`,
      supervisorName: `Supervisor ${generateRandomString(4)}`,
      supervisorEmail: `supervisor${i}@example.com`,
      startDate: generateRandomDate(2023, 2025).toISOString(),
      endDate: generateRandomDate(2025, 2027).toISOString(),
      projectDeadline: generateRandomDate(2025, 2027).toISOString(),
      estimatedBudget: Math.floor(Math.random() * 100000),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // Insert the projects into the database using queryInterface
  await queryInterface.bulkInsert('Projects', projects, {});
};

const down = async (queryInterface) => {
  // Revert changes made by the seed
  await queryInterface.bulkDelete('Projects', null, {});
};

module.exports = { up, down };
