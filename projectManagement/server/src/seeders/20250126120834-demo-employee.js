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

module.exports = {
  up: async (queryInterface) => {
    const employees = [];
    for (let i = 25001; i <= 30000; i++) {
      employees.push({
        name: `Employee1 ${generateRandomString(5)}`,
        email: `employee${i}@example.com`,
        password: `password${generateRandomString(8)}`,
        phone: `+1${Math.floor(Math.random() * 1000000000)}`,
        dob: generateRandomDate(1980, 2000).toISOString().split('T')[0], // Generate a date between 1980 and 2000
        gender: Math.random() > 0.5 ? 'Male' : 'Female',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Insert the employees into the database using queryInterface
    await queryInterface.bulkInsert('employees', employees, {});
  },

  down: async (queryInterface) => {
    // Revert changes made by the seed
    await queryInterface.bulkDelete('employees', null, {});
  }
};
